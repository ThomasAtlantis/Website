from datetime import datetime
import itertools
import json
import requests
from multiprocessing import Pool
from requests.compat import urlencode
from dataclasses import dataclass
from pathlib import Path
import tyro
import re


@dataclass
class Config:
    target_dir: str = 'zhihu'


def get_column_dict(config):
    params = {
        'include': ','.join(['data[*].column.intro', 'articles_count', 'items_count']),
        'offset': 0,
        'limit': 20,
    }
    url = "https://www.zhihu.com/api/v4/members/qing_chuan/column-contributions"
    url = url + '?' + urlencode(params)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
    }
    cookies = {
        "z_c0": "2|1:0|10:1756820329|4:z_c0|80:MS4xUDhuRUF3QUFBQUFtQUFBQVlBSlZUV2VJbG1sSF9ZY1JQdTNGSjNOaWJwcFd1WlVBQ3FEaXN3PT0=|da2bd714560338fd3f6bdf9789931b95bf9efc02f3bc979c74cdd53e3c2e6452",
    }
    data = []
    while True:
        response = requests.get(url, headers=headers, cookies=cookies).json()
        data += response['data']
        if response['paging']['is_end']:
            break
        url = response['paging']['next']
    output = {}
    for column_data in data:
        column = column_data['column']
        output[column['id']] = {
            'title': column['title'],
            'description': column['intro'],
            'type': 'category',
            'items_count': column['items_count'],
            'children': {},
            'target_dir': config.target_dir,
            'updated_time': column['updated'],
        }
    return output


def get_column_article_dict(column_item):
    column_id, new_column = column_item

    old_column = {}
    column_json_file = Path(new_column['target_dir']) / f'{column_id}.json'
    if column_json_file.exists():
        with open(column_json_file, 'r', encoding='utf-8') as f:
            old_column = json.load(f)
    if old_column and old_column['updated_time'] >= new_column['updated_time']:
        return old_column

    if new_column['items_count'] != 0:
        url = f"https://www.zhihu.com/api/v4/columns/{column_id}/items?ws_qiangzhisafe=0"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
        }
        cookies = {
            "z_c0": "2|1:0|10:1756820329|4:z_c0|80:MS4xUDhuRUF3QUFBQUFtQUFBQVlBSlZUV2VJbG1sSF9ZY1JQdTNGSjNOaWJwcFd1WlVBQ3FEaXN3PT0=|da2bd714560338fd3f6bdf9789931b95bf9efc02f3bc979c74cdd53e3c2e6452",
        }
        data = []
        while True:
            response = requests.get(url, headers=headers, cookies=cookies).json()
            data += response['data']
            if response['paging']['is_end']:
                break
            url = response['paging']['next']

        for article in data:
            if article['type'] == 'answer':
                title = article['question']['title']
                href = f"https://www.zhihu.com/question/{article['question']['id']}/answer/{article['id']}"
                updated_time = article['updated_time']
                created_time = article['created_time']
                id_ = article['question']['id'] + '_' + article['id']
            else:
                title = article['title']
                href = article['url']
                updated_time = article['updated']
                created_time = article['created']
                id_ = article['id']

            if (
                old_column
                and id_ in old_column['children']
                and old_column['children'][id_]['updated_time'] >= updated_time
            ):
                new_column['children'][id_] = old_column['children'][id_]
                continue

            new_column['children'][id_] = {
                'title': title,
                'href': href,
                'type': article['type'],
                'updated_time': updated_time,
                'created_time': created_time,
            }

            print(
                f'Updated: {title}, time: {datetime.fromtimestamp(updated_time).strftime("%Y-%m-%d %H:%M:%S")}'
            )
            content = article['content']
            with open(Path(new_column['target_dir']) / f'{id_}.html', 'w', encoding='utf-8') as f:
                f.write(content)
    with open(column_json_file, 'w', encoding='utf-8') as f:
        json.dump(new_column, f, ensure_ascii=False, indent=2)
    return new_column


def retrieve_other_articles(current_articles, config):
    column_id, new_column = "c_0", {
        'type': 'category',
        'title': '其他文章',
        'description': '未发布在专栏中的文章',
        'children': {},
        'target_dir': config.target_dir,
        'updated_time': datetime.now().timestamp(),
    }
    old_column = {}
    column_json_file = Path(config.target_dir) / f'{column_id}.json'
    if column_json_file.exists():
        with open(column_json_file, 'r', encoding='utf-8') as f:
            old_column = json.load(f)

    params = {
        'include': ';'.join(
            [
                ','.join(
                    [
                        'data[*].comment_count',
                        'suggest_edit',
                        'is_normal',
                        'thumbnail_extra_info',
                        'thumbnail',
                        'can_comment',
                        'comment_permission',
                        'admin_closed_comment',
                        'content',
                        'voteup_count',
                        'created',
                        'updated',
                        'upvoted_followees',
                        'voting',
                        'review_info',
                        'reaction_instruction',
                        'is_labeled',
                        'label_info',
                    ]
                ),
                'data[*].vessay_info',
                'data[*].author.badge[?(type=best_answerer)].topics',
                'data[*].author.kvip_info',
                'data[*].author.vip_info',
            ]
        )
        + ';',
        'offset': 0,
        'limit': 20,
        'sort_by': 'created',
        'ws_qiangzhisafe': 0,
    }
    url = "https://www.zhihu.com/api/v4/members/qing_chuan/articles?" + urlencode(params)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
    }
    cookies = {
        "z_c0": "2|1:0|10:1756820329|4:z_c0|80:MS4xUDhuRUF3QUFBQUFtQUFBQVlBSlZUV2VJbG1sSF9ZY1JQdTNGSjNOaWJwcFd1WlVBQ3FEaXN3PT0=|da2bd714560338fd3f6bdf9789931b95bf9efc02f3bc979c74cdd53e3c2e6452",
    }
    data = []
    while True:
        response = requests.get(url, headers=headers, cookies=cookies).json()
        data += response['data']
        if response['paging']['is_end']:
            break
        url = response['paging']['next']
    new_articles = {}
    for item in data:
        if item['id'] in current_articles:
            continue
        if (
            old_column
            and item['id'] in old_column['children']
            and old_column['children'][item['id']]['updated_time'] >= item['updated']
        ):
            new_articles[item['id']] = old_column['children'][item['id']]
            continue
        print(
            f'Updated: {item["title"]}, time: {datetime.fromtimestamp(item["updated"]).strftime("%Y-%m-%d %H:%M:%S")}'
        )
        new_articles[item['id']] = {
            'title': item['title'],
            'href': item['url'],
            'type': item['type'],
            'updated_time': item['updated'],
            'created_time': item['created'],
        }
        with open(Path(config.target_dir) / f"{item['id']}.html", 'w', encoding='utf-8') as f:
            f.write(item['content'])
    new_column['children'] = new_articles
    with open(column_json_file, 'w', encoding='utf-8') as f:
        json.dump(new_column, f, ensure_ascii=False, indent=2)
    return new_column


def retrieve_other_answers(current_articles, config):
    column_id, new_column = "c_1", {
        'type': 'category',
        'title': '其他回答',
        'description': '未发布在专栏中的回答',
        'children': {},
        'target_dir': config.target_dir,
        'updated_time': datetime.now().timestamp(),
    }
    old_column = {}
    column_json_file = Path(config.target_dir) / f'{column_id}.json'
    if column_json_file.exists():
        with open(column_json_file, 'r', encoding='utf-8') as f:
            old_column = json.load(f)

    params = {
        'include': ';'.join(
            [
                ",".join(
                    [
                        "data[*].is_normal",
                        "admin_closed_comment",
                        "reward_info",
                        "is_collapsed",
                        "annotation_action",
                        "annotation_detail",
                        "collapse_reason",
                        "collapsed_by",
                        "suggest_edit",
                        "comment_count",
                        "can_comment",
                        "content",
                        "editable_content",
                        "attachment",
                        "voteup_count",
                        "reshipment_settings",
                        "comment_permission",
                        "created_time",
                        "updated_time",
                        "review_info",
                        "excerpt",
                        "paid_info",
                        "reaction_instruction",
                        "is_labeled",
                        "label_info",
                        "relationship.is_authorized",
                        "voting",
                        "is_author",
                        "is_thanked",
                        "is_nothelp",
                    ]
                ),
                "data[*].vessay_info",
                "data[*].author.badge[?(type=best_answerer)].topics",
                "data[*].author.kvip_info",
                "data[*].author.vip_info",
                "data[*].question.has_publishing_draft,relationship",
            ]
        )
        + ';',
        'offset': 0,
        'limit': 20,
        'sort_by': 'created',
        'ws_qiangzhisafe': 0,
    }
    url = "https://www.zhihu.com/api/v4/members/qing_chuan/answers?" + urlencode(params)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
    }
    cookies = {
        "z_c0": "2|1:0|10:1756820329|4:z_c0|80:MS4xUDhuRUF3QUFBQUFtQUFBQVlBSlZUV2VJbG1sSF9ZY1JQdTNGSjNOaWJwcFd1WlVBQ3FEaXN3PT0=|da2bd714560338fd3f6bdf9789931b95bf9efc02f3bc979c74cdd53e3c2e6452",
    }
    data = []
    while True:
        response = requests.get(url, headers=headers, cookies=cookies).json()
        data += response['data']
        if response['paging']['is_end']:
            break
        url = response['paging']['next']
    new_answers = {}
    for item in data:
        id_ = item['question']['id'] + '_' + item['id']
        if id_ in current_articles:
            continue
        if (
            old_column
            and id_ in old_column['children']
            and old_column['children'][id_]['updated_time'] >= item['updated_time']
        ):
            new_answers[id_] = old_column['children'][id_]
            continue
        print(
            f'Updated: {item["question"]["title"]}, time: {datetime.fromtimestamp(item["updated_time"]).strftime("%Y-%m-%d %H:%M:%S")}'
        )
        new_answers[id_] = {
            'title': item['question']['title'],
            'href': f"https://www.zhihu.com/question/{item['question']['id']}/answer/{item['id']}",
            'type': 'answer',
            'updated_time': item['updated_time'],
            'created_time': item['created_time'],
        }
        with open(Path(config.target_dir) / f"{id_}.html", 'w', encoding='utf-8') as f:
            f.write(item['content'])
    new_column['children'] = new_answers
    with open(column_json_file, 'w', encoding='utf-8') as f:
        json.dump(new_column, f, ensure_ascii=False, indent=2)
    return new_column


def retrieve_moments(config):
    column_id, new_column = "c_2", {
        'type': 'category',
        'title': '想法',
        'description': '想法',
        'children': {},
        'target_dir': config.target_dir,
        'updated_time': datetime.now().timestamp(),
    }
    old_column = {}
    column_json_file = Path(config.target_dir) / f'{column_id}.json'
    if column_json_file.exists():
        with open(column_json_file, 'r', encoding='utf-8') as f:
            old_column = json.load(f)

    params = {
        'offset': 0,
        'limit': 20,
        'includes': ','.join(['data[*].upvoted_followees', 'admin_closed_comment']),
    }
    url = "https://www.zhihu.com/api/v4/v2/pins/qing_chuan/moments?" + urlencode(params)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
    }
    cookies = {
        "z_c0": "2|1:0|10:1756820329|4:z_c0|80:MS4xUDhuRUF3QUFBQUFtQUFBQVlBSlZUV2VJbG1sSF9ZY1JQdTNGSjNOaWJwcFd1WlVBQ3FEaXN3PT0=|da2bd714560338fd3f6bdf9789931b95bf9efc02f3bc979c74cdd53e3c2e6452",
    }
    data = []
    while True:
        response = requests.get(url, headers=headers, cookies=cookies).json()
        data += response['data']
        if response['paging']['is_end']:
            break
        url = response['paging']['next']
    new_moments = {}
    for item in data:
        if (
            old_column
            and item['id'] in old_column['children']
            and old_column['children'][item['id']]['updated_time'] >= item['updated']
        ):
            new_moments[item['id']] = old_column['children'][item['id']]
            continue
        title = re.search(r'^(.*?)<br>', item['excerpt_title'])
        if not title:
            title = item['excerpt_title'][:20] + '...'
        else:
            title = title.group(1)
            if len(title) > 20:
                title = title[:20] + '...'
        print(
            f'Updated: {title}, time: {datetime.fromtimestamp(item["updated"]).strftime("%Y-%m-%d %H:%M:%S")}'
        )
        new_moments[item['id']] = {
            'title': title,
            'href': item['url'],
            'type': 'moment',
            'updated_time': item['updated'],
            'created_time': item['created'],
        }
        with open(Path(config.target_dir) / f"{item['id']}.html", 'w', encoding='utf-8') as f:
            f.write(item['content_html'])
    new_column['children'] = new_moments
    with open(column_json_file, 'w', encoding='utf-8') as f:
        json.dump(new_column, f, ensure_ascii=False, indent=2)
    return new_column


if __name__ == '__main__':
    config = tyro.cli(Config)
    print("Updating Zhihu column articles...")
    Path(config.target_dir).mkdir(parents=True, exist_ok=True)
    output = get_column_dict(config)
    with Pool(processes=4) as pool:
        output = pool.map(get_column_article_dict, output.items())
    output = [item for item in output if item is not None]
    current_articles = itertools.chain.from_iterable([item['children'].keys() for item in output])
    print('Zhihu column articles updated successfully!')
    print('-' * 10)
    print("Updating Zhihu other articles...")
    retrieve_other_articles(current_articles, config)
    print("Zhihu other articles updated successfully!")
    print('-' * 10)
    print("Updating Zhihu other answers...")
    retrieve_other_answers(current_articles, config)
    print("Zhihu other answers updated successfully!")
    print('-' * 10)
    print("Updating Zhihu moments...")
    retrieve_moments(config)
    print("Zhihu moments updated successfully!")
    print('-' * 10)
    print("Zhihu all updated successfully!")
    print('-' * 10)
