// menu has 2 states authorize or guest (not authorize)

window.addEventListener('hashchange', (e) => {
    switch (window.location.hash) { // window est un objet avec un objet location à l'intérieur et hash est un attribut de location qui est aussi un attribut de window
        case "#blog": // Quand on lit on met un #
            // todo: WC post-read call by displayBlog()
            // surment ce servir de list-posts aussi
            displayBlog()
            break;
        case '#login':
            // todo: WC auth-login call by displayLogin()
            displayLogin()
            break;
        case '#subscribe':
            // todo: WC auth-subs call by displaySubs()
            displaySubs()
            break;
        case "#account":
            // todo: WC user-account call by displayAccount()
            displayAccount()
            break;
        case "#articles":
            // todo: WC list-posts and handling-post call by displayArticles()
            displayArticles()
            break;
        case "#logout":
            // todo: logout action eg: remove auth token the return to landing page
            applyLogout()
            break;
        case '':
            window.location.hash = 'blog'; // Quand on l'écrit on met pas de #
            break;
        default:
            alert('alert')
            break;
    }
});

function displayBlog() {
    //display landing page blog
    console.log('in display_blog ')

    // teacher: this need to make sure that the page only contain post-read WC
    //  need to remove what is currently in the page
    //  ex: load 3 blog post then lazy load the rest via a pager or scroll

    // TODO
    // display nav bar with blog title and a login button 
    // list blog post by calling list-posts in guest mode
    // do not display all posts lazy load them either with a pager or on a scroll treshold event
    //
    // post data needed:
    //  title
    //  author name
    //  published date
    //  content

    
};

function displayLogin() {
    // display the login page
    console.log('in app.js displayLogin')

    // TODO
    // opional: make it modal
    // blog is hidden or remove 
    // then show login form 
    // with a subscribe button
    // and usual email and password connect cancel
    // edge case: user is already logged in show his account page maybe
    // data send to api when connect button is click: 
    //  email
    //  password => hash sha-256 => send to api

    // after a successfull login return to blog landing page but with personnalized nav bar
    // eg: blog title, My articles, My account, ${user.email}, logout
    
    // return token
};

function displaySubs() {
    // account creation form => access via the login page
    console.log('in app.js displaySubs')

    // TODO
    // form with :
    //  email
    //  password
    //  password nag
    //  first name
    //  last name
    //  cancel => return to landing page
    //  subscribe => send above field to api await a response
    // if sucess => the user is created and then return to the login page
    // if error => the frontend is alerted and let the user known then return to login page. error verbosity tbd
};

function displayArticles(){
    // user personnalized page with control over his articles
    console.log('in app.js displayArticles')

    // TODO
    // create a route that will fetch only the posts from an user either id or authorId or userId tbd
    // optional multiple publish or delete with checkbox
    // the below actions need to work:
    //  create a post
    //  edit post on this row
    //  delete post on this row
    //  publish button in cell if the post publishedDate is NULL
};

function displayAccount() {
    // user personnalized account page
    console.log('in app.js displayAccount')
    
    // TODO
    // email is not editable
    // first name and last name are editable and have dedicated save button
    // password can be change 
    //  by providing current password, new password and new password again. 
    //  has a dedicated save buttton
    // optional: delete account button
    // optional: lost my password

};

function applyLogout() {
    // logout user
    console.log('in app.js applyLogout')

    // TODO
    // if user has token send logout to api
    // then redirect to landing page eg: #blog
    // validate nav bar
};
