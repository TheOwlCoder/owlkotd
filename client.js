const keywords = ["slain", "executed"];
let moved = false;
async function getLatestPosts() {
    document.querySelectorAll(".post").forEach((i) => {
        i.remove()
    })
    const response = await fetch('https://www.reddit.com/r/kickopenthedoor/new.json');
    const data = await response.json();
    const posts = data.data.children;
    console.log(posts[2])
    posts.forEach(post => {
        if (post.data.title.split("").includes(":")) {
            const flair = post.data.link_flair_text
            console.log(flair)
            const postDiv = document.createElement("div");
            console.log(post.data.id)
            postDiv.classList = "post"
            // console.log(post)
            if (keywords.some(keyword => flair.split(" ").includes(keyword))) {
                health = "Slain by " + flair.split(" ")[flair.split(" ").indexOf("by") + 1]
            } else {
                health = flair.split(":")[1].slice(0, -1);
            }
            if (moved) postDiv.style.marginLeft = "-700px";
            postDiv.innerHTML = `
        <h1 class="name">${post.data.title.split("[Health:")[0]}</h1>
        <span class="stats">${flair.split(" ")[0] + " " + flair.split(" ")[1]}</span><p class="health"> Health: ${health}</p>
        <img style="position: absolute; top:0; left: 0; filter: blur(2px); z-index: -10; min-width: 530px; min-height: 260px" src="${post.data.thumbnail}">

        `
            // postDiv.style.backgroundImage = "url(" + post.data.thumbnail + ")"
            document.querySelector("#b").appendChild(postDiv)
            postDiv.onclick = () => { loadPost(post.data.id) }
        }
    });
}

getLatestPosts();

function movePosts() {
    const pb = document.querySelector("#postbox")
    // console.log(screen.width<501, screen.width, 360<501)
    if (screen.width > 501) {
        moved = true;
        document.querySelectorAll(".post").forEach((i) => {
            pb.style.display = "block"
            setTimeout(() => {
                i.style.marginLeft = "-700px";
                pb.style.right = "0"
            })
        })
    } else {
        pb.style.left = 0;
        pb.style.top = "100vh";
        pb.style.display = "block";
        pb.style.width = screen.width - 25 + "px";
        setTimeout(() => {
            pb.style.top = 0;
        }, 201)
    }
}

async function loadPost(url) {


    let post = await getRedditPost(url);
    let pb = document.getElementById("postbox");
    let cos = await fetchRedditComments(url);
    const flair = post.link_flair_text
    if (keywords.some(keyword => flair.split(" ").includes(keyword))) {
        health = "Slain by " + flair.split(" ")[flair.split(" ").indexOf("by") + 1]
    } else {
        health = flair.split(":")[1].slice(0, -1);
    }
    pb.innerHTML = `
    <span id="cpb" style="float:right">X</span>
    <a class="user" href="https://reddit.com${post.permalink}"><h1>${post.title}</h1></a>
    <p>Health: ${health}</p>
    <center>
    <img id="pimg" src="${post.thumbnail}">
    </center>
    <hr style="color: black">
    <p>Submitted by: ${cos[0].body.split("by:")[1].split("\n")[0]}<br>
    Art source: <span tooltip="This link may or may not lead somewhere"><a class="user" href="${cos[0].body.split("Source/Artist: ")[1].split("\n")[0]}">${cos[0].body.split("Source/Artist: ")[1].split("\n")[0]}</a></span>
    </p>
    <span id="comments"></span>
    `
    document.querySelector("#pimg").addEventListener("click", () => {
        document.getElementById("modalimg").src = document.querySelector("#pimg").src
        document.getElementById("modal").style.display = "flex"
        document.querySelector("#modal").addEventListener("click", () => {
            document.getElementById("modal").style.display = "none"
        })
    })
    document.querySelector("#cpb").addEventListener("click", () => {


        pb.style.right = "-520px"
        pb.style.left = "";
        pb.style.display = "none"
        document.querySelectorAll(".post").forEach((i) => {
            i.style.marginLeft = 0;
            moved = false;
        })
        console.log("closed")
    })

    console.log(await fetchRedditComments(url))
    let comments = document.getElementById("comments")
    cos.forEach((i) => {
        const com = document.createElement("div");
        com.classList = "comment"
        com.innerHTML = `<a class="user" href="https://reddit.com/u/${i.author}"><b>${i.author}</b></a><p>${i.body}</p>`;
        if (i.author != "KickOpenTheDoorBot") {
            comments.appendChild(com)
            // console.log(com)
        }
    })
    movePosts();
}

const fetchRedditComments = async (postId) => {
    const url = `https://www.reddit.com/comments/${postId}.json`;
    try {
        const response = await fetch(url);
        if (!response.ok) { throw new Error('response was not ok, someone check up on it') };
        const data = await response.json();
        const comments = data[1].data.children.map(comment => comment.data);
        return comments;
    } catch (error) {
        console.error('i messed something up', error);
    }
};

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