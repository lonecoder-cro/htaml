# What is HTAML?

HTAML (Hypertext Advance Markup Language) is not a replacement for [HTMX](http://www.htmx.org) and "Javascript" but to give developers and idea of what HTML would be without "Javascript" by adding htaml attributes to dom elements.

**This project was inspired by [jscoding](https://github.com/tsoding/HTMLang)**.

Note: **Due to school and other projects that or not currently public on my github, the develepment process of this project will be slow.**

# Usage
If your lazy just download the htaml.js file from the dist folder.

## Tips
* The fist argument for each htaml action except the bindto can be a h-dom:id value or a selector. The h-dom:id is faster, the element is already parsed where as a selector the element needs to be parsed first. The bindto action uses the h-dom:id and a input selector

* To prevent flickering of htaml elements on page load you can do as follow
 ```html
<style>
. htaml-hide {
     display: none !important;
  }
</style>
<body class="htaml-hide"></body>

<!-- After the dom is parsed the .htaml-hide class will be removed -->
```
* Instead of using htaml-attribute, it can also be used as h-,ht- or hta-.
```html
<div h-dom:data="{}" ht-dom:data="{}" hta-dom:data="{}" htaml-dom:data="{}"></div>
```

## htaml-on attribute
Use to trigger events on a dom element.

#### The :trigger action
Triggers an event on a element.

##### Modifiers:

* once: trigger the event once
* delay: delay the trigger by seconds or milliseconds.

##### Examples:

Here is a perfect example submititng a form using :trigger action
* Note: For form submission to work, h-dom:id="form" should be on the form tag.
```html
<form class="form" h-dom:id="form" h-dom:ignore="this" h-req:post="https://dummyjson.com/users/add">
    <div class="form--header">
        <h1>Register</h1>
    </div>
    <div class="form--content form--content--single">
        <div id="form__one">
            <div class="form--group">
                <input type="text" name="firstName" placeholder="First Name"  minlength="3">
            </div>
            <div class="form--group">
                <input  type="text" name="lastName" placeholder="Last Name" minlength="3">
            </div>
            <div class="form--group">
                <input name="email" type="email" placeholder="Email Address">
            </div>
            <div class="form--group">
                <input type="password" name="password" placeholder="Password" minlength="6">
            </div>
        </div>

    </div>
    <div class="form--footer">
        <button h-on:trigger="submit">Register</button>
        <button h-on:trigger="click once" h-req:get="apost.html" h-dom:swap="html inner">try
            async request</button>
    </div>
</form>
```

##### Buttons

```html

<button h-on:trigger="click"></button>

<!-- event only fires once -->
<button h-on:trigger="click once"></button>

<!-- delay in seconds or milliseconds -->
<button h-on:trigger="click delay:3s"></button>
<button h-on:trigger="click delay:3ms"></button>
```

## htaml-dom attribute
Use to modify the dom.

#### The :bindto action
Use to bind to a input element.

```html
<!-- element to bind to, when the value of this element changes, the changes will reflect on the other two elements -->
<input h-dom:id="domIdCanBeUsed" h-on:trigger="keyup"  type="text" name="firstName" placeholder="First Name"  minlength="3">

<!-- binding using name attribute -->
<input h-dom:bindto="firstName" type="text" name="lastName" placeholder="Last Name" minlength="3">
<!--  or using h-dom:id -->
<input h-dom:bindto="domIdCanBeUsed" type="text" name="lastName" placeholder="Last Name" minlength="3">
```

#### The :switch action

Similar to the :toggle action but only allows one element to be visible at a time on the DOM

##### Modifiers:
* attr: an attribute to target.
* active: set the current switch element as active by applying a class

##### Example:
```html
<!--  tabs -->
 <ul>
    <li class="tabactive" h-on:trigger="click" h-dom:switch="#ui attr:tab active:.tabactive">Ui</li>
    <li h-on:trigger="click" h-dom:switch="#web attr:tab active:.tabactive">Web </li>
    <li h-on:trigger="click" h-dom:switch="#bots attr:tab active:.tabactive">Bots</li>
    <li h-on:trigger="click" h-dom:switch="#shell attr:tab active:.tabactive">Shell</li>
</ul>

<section id="ui"></section>
<section id="web"></section>
<section id="bots"></section>
<section id="shell"></section>

```
#### The :toggle action

Used to toggle (on|off) an element on the DOM

##### Example:

```html
<section h-dom:data="{message:'If am been seen am been toggled'}">
    <button h-on:trigger="click" h-dom:toggle="#p" h-dom:proc="nextSibling onProcess:remove_old">Ui</button>
    <p id="p" h-dom:text="message"></p>
</section>
```

#### The :data action

Used to declare data and will also be evaluated as a javascript object.

Note: **A key inside the data object should not have a number value**

##### Example:

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

#### The :swap action
Used to swap the contents of a element with the requests body.

* Note: Swapping the root html outter contents will not work, however the inner contents will be replaced instead. If a title is found in the swap content it will be used as the title.

##### Modifiers:

default:
  * replace: Placement of the swap conntent.The value van be (outter|inner|this) where this is the current element.
  * transition: Transiton can also be applied after and before swapping occures.

transition:

```html
<!-- Simple swap -->
<button
    h-on:trigger="click"
    h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html"
    h-dom:swap="html replace:outter">Press Me To Swap
</button>

<!-- local swap from disk -->
<button
    h-on:trigger="click"
    h-req:get="swap.html"
    h-dom:swap="html replace:inner">Press Me To Swap
</button>

<!-- with transitons-->
<button
    h-on:trigger="click"
    h-req:get="swap.html"
    h-dom:swap="html replace:this transtion:beforeClassName,afterClassName">Press Me To Swap
</button>
```

#### The :cloak action
Can be use to hide a element on the DOM.

##### Example:
```html
<!-- Set the opacity of a element to 0 -->
<input  h-dom:cloak="cloak" type="text" name="firstName" placeholder="First Name" minlength="3">

<!-- Un-render the element from the DOM -->
<input  h-dom:cloak='none' type="text" name="firstName" placeholder="First Name" minlength="3">

<!-- Hides the element on the DOM-->
<input  h-dom:cloak='hidden' type="text" name="firstName" placeholder="First Name" minlength="3">
```

#### The :proc action
Use to process a DOM element with htaml attributes.

##### Modifiers:

on_process:
  * scroll: scroll to the bottom of the content.
  * replace: replace the process element with a clone version of itself.

##### Example:

```html
 <button h-dom:proc="users">Generate Random Users</button>

 <button
    h-on:trigger="click delay:500ms"
    h-dom:proc="users on_process:replace">Generate Random Users
</button>

<div h-dom:id="users" h-dom:cloak="cloak" h-dom:ignore="all"
    h-req:get="https://randomuser.me/api?results=10" h-req:out="rusers"
    h-run:if="this.response.status == 200 && rusers.results"
    h-run:for="person in rusers.results" id="projects__tabs-content">

    <div id="projects__project">
        <div id="projects__img">
            <img h-dom:src="person.picture.large" h-dom:alt="person.name.first" />
        </div>
        <div id="projects__info">
            <h3 h-dom:text="person.name.title,'.',person.name.first,&#32,person.name.last"></h3>
            <div>
                <p h-dom:text="person.location.timezone.description"></p>
            </div>
        </div>
        <div id="projects__link"><a h-dom:href="person.picture.large" target="_blank"
                h-dom:text="person.name.first"></a>
        </div>
    </div>
</div>
```

#### The ignore action
Tells the htaml stepper to skip proccessing of this element or childerns.

##### Example:

```html
<!-- ignores the current element -->
 <div h-dom:ignore="this"  id="projects__ideas"> </div>

 <!-- ignores the current element and its childrens-->
<div h-dom:ignore="all"  id="projects__ideas"></div>
```

#### The :text action
Used to set the innerText of a DOM element.

```html
<parent h-dom:data="{msg:'Wagwaan'}">
    <div h-dom:text="msg,' ',it's me!!!"></div>
</parent>
```

## htaml-req/areq attribute
Can be use to perform synchronous/asynchronous requesst

* out - output result to a variable
* config - used to configure the request
* get - perform a GET request

#### The :req/areq action

##### Example:
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
## htaml-run attribute
Used to perform if statements and for loops.

#### The :if action
The if action is use to toggle elements on and off on the dom if the result is true

 * Note: **The if action automatically removes the element from the DOM and removes the dom:cloak attribute if added.**

##### Example:

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

#### The :for action

The for action allows you perform loops. This action **MUST**  be declared on any element that **MUST** contain root element/elements.

Note: **After each for loop, the h-dom:cloak attribute is remove off each element if added**.

 *  Tip: The index is supplied through a automatic variable "i"

##### Examples:
Looping over a list.
```html
<section id="skills" class="observer">
    <h-script>
        const skills = [
            {
                'name': 'Mobile App Skills',
                'skills': [
                "PWA's",
                'NativaScript',
                'Android Studio'
                ],
            }
        ];
        return skills;
    </h-script>

    <div h-run:for="skill in skills" id="skills__cards">
        <div id="skills__card">
            <h3 h-dom:text="skill.name"></h3>
            <ul h-run:for="name in skill.skills">
                <li h-dom:text="name"></li>
            </ul>
        </div>
    </div>
</section>
```

Getting acces to the index.
```html

<!-- through automatice variable called i -->
<div h-run:for="skill in skills" id="skills__cards">
    <div id="skills__card">
        <h3 h-dom:text="skill.skills[i].name"></h3>
    </div>
</div>

<!-- or defined your own -->
<div h-run:for="skill in skills;x=index" id="skills__cards">
    <div id="skills__card">
        <h3 h-dom:text="skill.skills[x].name"></h3>
    </div>
</div>
```

## HScript Tag
Used to declare javascript code.

Note: **\<h-script> tags can only contain one root level element. To get access to a variable you simple return it. You can also get access to a declare variable by using the $ symbol in front the variable name**.

##### Example:

```html
<div h-dom:data="{value:8}">
     <h-script>
          const list = [6,70,90,4,$value,7].map((i) => i > $value)
          return list;
     </h-script>

     <div h-dom:cloak="cloak" h-run:for="num in list"
          <p h-dom:text="num, + index =,' ',num+i"></p>
      </div>

</div>
```
