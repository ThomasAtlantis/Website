from typing import cast
from bs4.element import Tag
import requests
from bs4 import BeautifulSoup
import re
import json
from urllib.request import urlretrieve
import urllib.request
from pathlib import Path
import threading
import tyro
from dataclasses import dataclass


@dataclass
class Args:
    target_dir: str = "tmp/douban_activity"
    year: str = "2021"


def getDoubanActivity(year: str, target_dir: str):
    image_dir = Path(target_dir) / "activity_images"
    image_dir.mkdir(exist_ok=True)

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
    }

    opener = urllib.request.build_opener()
    opener.addheaders = list(headers.items())
    urllib.request.install_opener(opener)

    res = requests.get("https://www.douban.com/note/826626111", headers=headers)
    soup = BeautifulSoup(res.text, features='lxml')
    p = cast(Tag, soup.find("h3", {"id": "时间线"}))
    p = cast(Tag, p.next_sibling)

    date_pattern = re.compile(r'^[0-9]+\.[0-9]+')
    activities = []

    lock = threading.Lock()

    def retrieve_image(image_url, image_file):
        urlretrieve(image_url, image_dir / image_file)
        with lock:
            print(f"`{image_file}` downloaded")

    threads = []
    while p.name != 'h2':
        if p.name == 'div' and p.find("img"):
            image_url = cast(str, cast(Tag, p.find("img"))['src'])
            image_file = image_url.split('/')[-1]
            if not (image_dir / image_file).exists():
                thread = threading.Thread(target=retrieve_image, args=(image_url, image_file))
                thread.start()
                threads.append(thread)
            activities[-1]['images'].append(image_file)
        elif p.name == 'blockquote':
            activities[-1]['content'] += f"<blockquote>{p.text}</blockquote>"
        else:
            date = date_pattern.search(p.text)
            if not date:
                if p.text.startswith("同一天，"):
                    date = activities[-1]['date']
                    content = p.text[len("同一天，") :].strip()
            else:
                date = date.group(0)
                content = p.text[len(date) :].strip()
                date = '-'.join([year] + date.split('.'))
            activities.append({"title": "", "date": date, "content": content, "images": []})
        p = cast(Tag, p.next_sibling)

    for thread in threads:
        thread.join()

    with open(Path(target_dir) / "activities.tsx", 'w', encoding='utf-8') as f:
        f.write("export const ActivityData = ")
        f.write(json.dumps(activities, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    args = tyro.cli(Args)
    getDoubanActivity(args.year, args.target_dir)
