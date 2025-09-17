from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import urlretrieve
import requests
from bs4 import BeautifulSoup
import json
import re
import tyro
from dataclasses import dataclass


@dataclass
class Args:
    target_dir: str = "tmp/douban_review"


def retrieve_image(image_url, image_file):
    if image_file.exists():
        return
    urlretrieve(image_url, image_file)
    print(f"`{image_file}` downloaded")


def getDoubanReviewList():
    url = "https://www.douban.com/people/liushangyu/reviews"
    response = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        },
    )
    soup = BeautifulSoup(response.text, "html.parser")
    reviews = soup.find_all("div", class_="review-item")
    review_list = []

    for review in reviews:
        title_tag = review.find("div", class_="main-bd").find("h2").find("a")
        title = title_tag.text
        url_content = title_tag["href"]
        rating_tag = review.find("header", class_="main-hd").find("span", class_="main-title-rating")
        rating = re.compile(r'(\d+)').search(rating_tag.attrs['class'][0])
        assert rating is not None
        rating = int(rating.group(1)) / 5
        image_tag = review.find("a", class_="subject-img")
        url_image = image_tag.find("img")["src"]
        url_item = image_tag["href"]
        updated = review.find("header", class_="main-hd").find("span", class_="main-meta").text
        review_list.append(
            {
                "_id": review.attrs['id'],
                "title": title,
                "url_item": url_item,
                "url_image": url_image,
                "url_content": url_content,
                "rating": rating,
                "updated": updated,
            }
        )
    return review_list


if __name__ == "__main__":
    args = tyro.cli(Args)
    target_dir = Path(args.target_dir)
    (target_dir / "review_images").mkdir(parents=True, exist_ok=True)
    review_list = getDoubanReviewList()
    with ThreadPoolExecutor(max_workers=10) as executor:
        for i, review in enumerate(review_list):
            image_file = Path("review_images") / review["url_image"].split("/")[-1]
            executor.submit(retrieve_image, review["url_image"], target_dir / image_file)
            review_list[i]["cover"] = str(image_file)
    executor.shutdown(wait=True)
    with open(target_dir / "reviews.json", "w") as f:
        json.dump(review_list, f, ensure_ascii=False, indent=2)
