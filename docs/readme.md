# HTAML Attributes Identifiers

HTAML (Hypertext Advance Markup Language) is a...

## Tips

* To prevent flickering of dom elements you can do as follow
 ```html
<!-- Use builting class for smooth transition to visible on page load -->
<body class="htaml-fadein-active"></body>

<!-- To prevent flicker on page load use class htaml-cloak with a opacity of 0
The class will be remove once the dom has be parsed -->
<style> .htaml-cloak {opacity: 0}</style>
<body class='htaml-cloak'></body>
```

## h-/ht/hta/htaml-on
Use to trigger events, all html elements work
* modifiers= once | delay:2(s|m)

```html
<!-- Simple swap -->
<button h-on:trigger="click"></button>

<!-- usr presson once -->
<button h-on:trigger="click once"></button>

<!-- seconds or milliseconds -->
<button h-on:trigger="click delay:3s"></button>
```

## h-/ht/hta/htaml-dom
Use to modify the dom

#### The flick action

Similar to toggle but only allows one element to be visible at a time on the DOM

##### Modifiers:
* attr: an attribute to target example: <div tab>
* active: set the current flick element as active.
```html
<!-- Example with tabs -->
 <ul>
    <li class="tabactive" h-on:trigger="click" h-dom:flick="#ui attr:tab active:.tabactive">Ui</li>
    <li h-on:trigger="click" h-dom:flick="#web attr:tab active:.tabactive">Web </li>
    <li h-on:trigger="click" h-dom:flick="#bots attr:tab active:.tabactive">Bots</li>
    <li h-on:trigger="click" h-dom:flick="#shell attr:tab active:.tabactive">Shell</li>
</ul>

<section id="ui"></section>
<section id="web"></section>
<section id="bots"></section>
<section id="shell"></section>

```
#### The toggle action

Used to toggle (on|off) an element on the DOM

```html
<section h-dom:data="{message:'If am been seen am been toggled'}">
    <button h-on:trigger="click" h-dom:toggle="#p" h-dom:proc="nextSibling onProcess:remove_old">Ui</button>
    <p id="p" h-dom:text="message"></p>
</section>
```

#### The data action

Used to declare object like data
Note: A key inside the data object should not have a number value

```html
<header h-dom:data="{about:'About',skills:'Skills'}">
    <div>
        <a href="/">
            <h2>Japho<span>lio</span></h2>
        </a>
    </div>
    <div h-dom:data="{services:'Services',projects:'Projects',contact:'Contact'}">
        <a href="#about" h-dom:text="about"></a>
        <a href="#skills" h-dom:text="skills"></a>
        <a href="#services" h-dom:text="services"></a>
        <a href="#projects" h-dom:text="projects"></a>
        <a href="#contact" h-dom:text="contact"></a>
    </div>
</header>

<!-- Note haveing a key name "j" on the parent and also haveing the same key on a child,
this will not overwrite the previous key but will get the result from the last key -->

<header h-dom:data="{j:'Hel'}">
    <div>
        <a href="/">
            <h2 h-dom:data="{j:'Japho',l:'lio'}" h-dom:text="j"><span h-dom:text="l"></span></h2>
        </a>
    </div>
</header>

<!-- The innerText for the h2 will be Japholio -->
```

#### The swap action

Used to swap the request body with.

* Note: swapping the root html outter contents will not work, however the inner contents will be replaced instead

```html
<!-- Simple swap -->
<button h-on:trigger="click"
h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html"
h-dom:swap="html">Press Me ToSwap
</button>

<!--
You can also specify where the request content can be swapped by providing one of the following after the swap action.
    outter
    inner
    this
-->
<button h-dom:swap="html this">Press Me ToSwap</button>

<!--
Transiton can also be applied after and before swapping occures
-->
<button h-dom:swap="html this transtion:beforeClassName,afterClassName">Press Me ToSwap</button>
```

#### The cloak action

* Can be use to hide a element

```html
<!-- Set the opacity of a element to 0 -->
<input  h-dom:cloak="cloak" type="text" name="firstName" placeholder="First Name" minlength="3">

<!-- Un-render the element from the DOM using display block as none-->
<input  h-dom:cloak='none' type="text" name="firstName" placeholder="First Name" minlength="3">

<!-- Hides the element on the DOM-->
<input  h-dom:cloak='hidden' type="text" name="firstName" placeholder="First Name" minlength="3">
```

#### The proc action

 * Use to process a htaml element.
 * Note: modifiers can also be used

```html
 <div id="projects__ideas">

    <button h-on:trigger="click" h-dom:proc="nextSibling onProcess:remove_old">Generate Random Users</button>

    <div h-req:get="https://randomuser.me/api?results=10"
        h-req:out="random" h-run:for="person in random.results"
        id="projects__tabs-content">
        <div id="projects__project">
            <div id="projects__img">
                <img h-dom:src="person.picture.large" h-dom:alt="person.name.first" />
            </div>
            <div id="projects__info">
                <h3 h-dom:text="person.name.title,person.name.first,person.name.last"></h3>
                <div>
                    <p h-dom:text="person.location.timezone.description"></p>
                </div>
            </div>
            <div id="projects__link"><a h-dom:href="person.picture.large" target="_blank"
                    h-dom:text="person.name.first"></a>
            </div>
        </div>
    </div>
</div>
```

#### The ignore action

 * Any element with this action is ignored

```html
 <div h-dom:ignore="this"  id="projects__ideas"></div>
```

#### The text action
```html
<parent h-dom:data={text:'Wagwaan'}>
    <div h-dom:text='text'></div>
</parent>
```

## h-/ht/hta/htaml-req/areq
Can be use to perform synchronous/asynchronous requesst

* out - output result to a variable
* config - used to configure the request
* get - perform a GET request

#### The req/areq action
```html
<!-- synchronous requests -->
<div h-req:get="https://api.github.com/users/"></div>

<!-- asynchronous request -->
<div h-areq:get="https://jsonplaceholder.typicode.com/photos"></div>

<!-- configuring the request -->
<div
h-req:config="{
    credentials:true,
    timeout:5000,
    headers:{
        'content-type':'application/json'
    }
}"
h-req:get="https://api.github.com/users/"></div>

<!-- output response to a variable -->
<div h-req:get="https://api.github.com/users/" h-req:out="myVar"></div>
```
## h-/ht/hta/htaml-run
  Actions
  * for
  * code


#### The if action

 * The if action is use to toggle elements on and off on the dom if the result is true
 * Note: a if action automatically removes the element from the dom and removes the dom:cloak attribute if add

```html
<div h-run:if="document.body.querySelector('div')"></div>

<div
h-req:get="https://api.github.com/users"
h-req:out="users"
h-run:if="users.length && users.length == 30"
h-run:for="user in users"
id="projects__tabs-content">
    <div id="projects__project">
        <div id="projects__img">
            <img h-dom:src="user.avatar_url" h-dom:alt="user.login" />
        </div>
        <div id="projects__info">
            <h3 h-dom:text="user.login,user.id"></h3>
            <div>
                <p h-dom:text="user.id"></p>
            </div>
        </div>
        <div id="projects__link"><a h-dom:href="user.html_url" h-dom:text="user.login"
                target="_blank"></a>
        </div>
    </div>
</div>
```

#### The for action

 * The for action allows you perform loops. This action MUST  be declared on any element that MUST contain root element/elements
 * Note: after each for loop, the dom:cloak attribute is remove off each element if added.
 *  Tip: The index is supplied through a automatic variable "i"

```html
<h-script>
    const skills = [
        {
        'name': 'Mobile App Skills',
        'skills': [
            "Flutter",
            'NativaScript',
            'Android Studio',
            ],
        },
        {
        'name': 'Frontend Skills',
        'skills': [
            'CSS3',
            'HTML5',
            'Angular+',
            'Typescript',
            'Javascript'
            ],
        },
        {
        'name': 'Backend Skills',
        'skills': [
            'Flask',
            'NodeJs',
            'Express',
            ],
        },
            {
        'name': 'Software/Hardware Skills',
        'skills': [
            'C',
            'C#',
            'Go',
            'Vbs',
            "AvrC",
            'Batch',
            'Python',
            'Kotlin\Java',
            ],
        },
        {
        'name': 'Essentials Skills',
        'skills': [
            'Azure',
            'Github',
            'Docker',
            'MongoDb',
            'Lucidchart'
            ],
        }
    ];
    return skills;
</h-script>

<div h-dom:cloak="cloak" h-run:for="skill in skills" id="skills__cards">
    <div h-run:if="i > 1 && i < 5" id="skills__card">
        <h3 h-dom:text="skill.name"></h3>
        <ul h-run:for="name in skill.skills">
            <li h-dom:text="name"></li>
        </ul>
    </div>
</div>
```

* Note: \<hscript> tags can only contain one root level element.
