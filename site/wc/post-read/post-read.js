import { authNextPosts } from "../../script/auth.js";

/**
 * Changez ce code pour répondre à votre besoins
 */
class postRead extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.postsReaded = [];
  }

  async loadContent() {
    /**
     * Renommez vos fichiers selon votre composant à vous
     */
    const [html, css] = await Promise.all([
      fetch("/wc/post-read/post-read.html").then((res) => res.text()),
      fetch("/wc/post-read/post-read.css").then((res) => res.text()),
    ]);

    const style = document.createElement("style");
    style.textContent = css;

    const template = document.createElement("template");
    template.innerHTML = html;

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  async connectedCallback() {
    await this.loadContent();

    const wrapperPosts_div = this.shadowRoot.getElementById("wrapperPosts");
    wrapperPosts_div.addEventListener("click", (e) => {
      const event = new CustomEvent("ready-next-posts", {
        detail: {
          mode: "display",
          postsReaded: [],
        },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(event);

      window.location.hash = "#blog";
    });

    const postsReaded_debug = [];
    const nextPostsResult = await authNextPosts(this.postsReaded, 3);
    nextPostsResult.posts.forEach((post, index) => {
      // console.log(post)
      this.addNextpost(post);
      // this.markAsReaded(post.id);
      postsReaded_debug.push(post.id);
      localStorage.setItem("postsReaded", JSON.stringify(this.postsReaded));
    });

    this.addPager()
  }

  addPager() {
    const pager_div = this.shadowRoot.getElementById("pager");
    const nextPost_btn = document.createElement("button")
    nextPost_btn.innerHTML = 'next'
    pager_div.appendChild(nextPost_btn)

    nextPost_btn.addEventListener('click', (e) => {
      // const nextPostsResult = await authNextPosts(this.postsReaded, 2);
    })
  }

  addNextpost(post) {
    const wrapperPosts_div = this.shadowRoot.getElementById("wrapperPosts");

    const postCard_div = document.createElement("div");
    postCard_div.classList.add("postCard");
    postCard_div.id = post.id;

    const titlePostHeader = document.createElement("h2");
    titlePostHeader.innerHTML = post.title;
    titlePostHeader.id = "postTitle";

    const postMeta_div = document.createElement("div");
    postMeta_div.classList.add("postMeta");

    const author_span = document.createElement("span");
    author_span.innerHTML = `${post.author.firstName} ${post.author.lastName}`;
    author_span.classList.add("author");

    const publishDate_span = document.createElement("span");
    publishDate_span.innerHTML = " | " + post.published;
    publishDate_span.classList.add("publishDate");

    const postContent_tag = document.createElement("p");
    postContent_tag.innerHTML = post.content;
    postContent_tag.id = "postContent";

    const sep_bar = document.createElement("hr");
    sep_bar.classList.add("sep");

    wrapperPosts_div.appendChild(postCard_div);
    postCard_div.appendChild(titlePostHeader);

    postCard_div.appendChild(postMeta_div);
    postMeta_div.appendChild(author_span);
    postMeta_div.appendChild(publishDate_span);

    postCard_div.appendChild(postContent_tag);
    postCard_div.appendChild(sep_bar);
  }

  markAsReaded(postId) {
    // this.postsReaded.push(postId)
    // localStorage.setItem("postsReaded",  JSON.parse(this.postsReaded));
    // this.postsReaded.push(postId)
    // localStorage.setItem("postsReaded",  this.postsReaded.toString());


    return localStorage.getItem("postsReaded");
  }
}

customElements.define("post-read", postRead);
