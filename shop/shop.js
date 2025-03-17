async function getRedditPost(postId) {
    const url = `https://www.reddit.com/comments/${postId}.json`;
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    });
    const data = await response.json();
    return data[0].data.children[0].data;
}

async function loadShop() {
    let data = await getRedditPost("167tvm4")
    let shop = document.querySelector("#shop")
    shop.innerHTML = data["selftext_html"].replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;#39;", "'")
    // console.log(data["selftext_html"].replaceAll("&lt;", "<").replaceAll("&gt;", ">"))
    shop.children[0].children[0].remove(); shop.children[0].children[0].remove();
}

loadShop()