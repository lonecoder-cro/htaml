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

**once**:
    trigger the event once.

**delay**:
    delay the trigger by seconds or milliseconds.

##### Examples:

Here is a perfect example submititng a form using :trigger action
* Note: For form submission to work, h-dom:id="form" should be on the form tag and h-on:trigger="submit" on the button tag.

```html
<!--
Since each htaml attributes or process in order, i used the h-dom:ignore="this" to stop processing of the form div.
After form submission the h-dom:ignore attribute will be removed so it can be processed.
 -->
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
    </div>
</form>
```

Here is some examples of buttons with triggers and modifiers.

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

##### Examples:

Here is an example.

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

**Note: This action can't be used without modifiers**.

##### Modifiers:
**attr** - a common attribute amoung the elements. Used as target.
  * attr:your_attribute

**active** - set the current switch element as active by applying a css class
  * active:your_class_name

##### Examples:

Here is an example using tabs.

```html
 <ul>
    <li class="tabactive" h-on:trigger="click" h-dom:switch="ui attr:tab active:tabactive">Ui</li>
    <li h-on:trigger="click" h-dom:switch="web attr:tab active:tabactive">Web </li>
    <li h-on:trigger="click" h-dom:switch="bots attr:tab active:tabactive">Bots</li>
    <li h-on:trigger="click" h-dom:switch="shell attr:tab active:tabactive">Shell</li>
</ul>

<section h-dom:id="ui" tab></section>
<section h-dom:id="web" tab></section>
<section h-dom:id="bots" tab></section>
<section h-dom:id="shell" tab></section>

```
#### The :toggle action

Used to toggle (on|off) an element on the DOM

**Note**: **DON'T USE**.

<!-- ##### Example:

```html
<section h-dom:data="{message:'If am been seen am been toggled'}">
    <button h-on:trigger="click" h-dom:toggle="#p" h-dom:proc="nextSibling onProcess:remove_old">Ui</button>
    <p id="p" h-dom:text="message"></p>
</section>
``` -->

#### The :data action

Can be used to declare variables. All variables or evaluated as javascript.

**Note**:
  * **The $ symbol can't be used inside the data attribute**.
  * **Similar keys gets overritten.**
  * **A key inside the data object should not have a number value.**

##### Examples:

Here is a example declaring variables.

```html
<header h-dom:data="{name:'Jaedan Willis',year_born:1998,thisYear:2023}">
    <p h-dom:text="'My name is ',name,' and i was born in ',year_born,' not ',thisYear"></p>
</header>
```

Here is a example of a overwritten variable.

```html
<header h-dom:data="{var1:'hi there'}">
    <p h-dom:data="{var1:'Wagwaan'}" h-dom:text="var1"></p>
</header>
```

#### The :swap action
Swaps the content of a element with the requests content.

**Note: Swapping the root html outter contents will not work, however the inner contents will be replaced instead. If a title is found in the swap content it will be used as the title**.

##### Modifiers:

**replace**: Placement of the swap content.
  * outter - swap the outter content of the element
  * inner - swap the inner contents of the element

##### Examples:

Here is a example of swapping.

```html
<!-- swaps the response content in this current element -->
<body h-on:trigger="click" h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html" h-dom:swap="swap">Press Me To Swap</body>

<!-- You can also swap a html file from disk. -->
<section h-on:trigger="click" h-req:get="swap.html" h-dom:swap="swap">Press Me To Swap</section>
```

Here is a example of swapping the inner/outter html of a element.

```html
<!-- the target element -->
<body h-dom:id="target"></body>

<!-- swapping the inner content of this element  -->
<section h-on:trigger="click" h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html" h-dom:swap="this">Swap Outter</section>

<!-- swapping the outter html of the target  -->
<button h-on:trigger="click" h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html" h-dom:swap="target replace:outter">Swap Outter</button>

<!-- swapping the inner html of the target   -->
<button h-on:trigger="click" h-req:get="http://127.0.0.1:5500/test/h-dom/swap.html" h-dom:swap="target replace:inner">Swap Inner</button>
```

#### The :cloak action
Can be use to hide a element on the DOM.

##### Examples:

```html
<!-- Set the opacity of a element to 0 -->
<input  h-dom:cloak="cloak" type="text" name="firstName" placeholder="First Name" minlength="3">

<!-- Un-render the element from the DOM -->
<input  h-dom:cloak="hide" type="text" name="firstName" placeholder="First Name" minlength="3">
```

#### The :proc action
Use to process a DOM element with htaml attributes.

##### Modifiers:

**on_process**: Runs after the element has been processes.
  * scroll - scroll to the bottom of the content.
  * replace - replace the process element with a clone version of itself.

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

#### The :text action and html attributes
Used to set the innerText of a DOM element.

## Tips:

As like the text action, any default html attributes can also be used
with the htaml-dom attribute.

##### Examples:

Text example.

```html
<section h-dom:data="{msg:'Wagwaan'}">
    <div h-dom:text="msg,' ',it's me!!!"></div>
</section>
```

Accessing default attributes.

```html
<section h-dom:data="{link:'https://www.google.com',placeHolder:'Enter text here',link_text:'Google'}">
    <a h-dom:href="link" h-dom:text="link_text"></a>
    <input h-dom:placeholder="placeHolder"></input>
    <img h-dom:alt="link_text" h-dom:src="link"></img>
</parent>
```

## htaml-req/areq attribute
Can be use to perform synchronous/asynchronous requesst.

##### Actions:
  * out - output result to a variable.
  * config - used to configure the request.
  * get - perform a GET request.
  * post - perform a POST request.

#### The :req/areq action
Used to perform synchronous/asynchronous web requests.

##### Example:

Sending a get sync/async request.

```html
<!-- synchronous requests -->
<div h-req:get="https://api.github.com/users/"></div>

<!-- asynchronous request -->
<div h-areq:get="https://jsonplaceholder.typicode.com/photos"></div>
```

Making a post sync/async request.

```html
<!-- using forms requests -->
<forms h-dom:id="form" h-dom:ignore="this" h-req:post="https://api.github.com/users/">
    <input type="text" name="text"></input>
    <button h-on:trigger="submit">Submit Form</button>
</forms>

<!-- for asynchronous request simple replace the req with areq -->
```

Configuring the request.

```html
<!-- request should be configured before sending the request -->
<div
    h-req:config="{
    credentials:true,
    timeout:5000,
    headers:{
        'content-type':'application/json'
    }
}"
    h-req:get="https://api.github.com/users/">
</div>
```

You may need access to the response form a requests. You can output the response to a variable like so...

```html
<div h-req:get="https://api.github.com/users/" h-req:out="yourVariable"></div>
```

Accessign the response object using (this).
```html
<div h-req:get="https://api.github.com/users/" h-run:if="this.response.status == 200"></div>
```


## htaml-run attribute
Used to perform if statements and for loops.

#### The :if action
The if action is use to toggle elements on and off on the dom if the result is true.

**Note: The if action automatically removes the element from the DOM and removes the dom:cloak attribute if added.**

##### Example:

```html
<div h-run:if="document.body.querySelector('div')"></div>
```

Using "htaml-run:if" to check if response is the required length.

```html
<div
    h-req:get="https://api.github.com/users"
    h-req:out="users"
    h-run:if="users.length && users.length == 30"
    h-run:for="user in users"
    id="projects__tabs-content">

    <p h-dom:text="users[0].id"></p>
</div>
```

#### The :for action

The for action allows you perform loops. This action **MUST**  be declared on a element that **MUST** contain root element/elements.

**Note: After each for loop, the "h-dom:cloak" attribute is remove off each element if added**.

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

Getting access to the index.

```html
<!-- through a supplier variable called (i) -->
<div h-run:for="skill in skills" id="skills__cards">
    <div id="skills__card">
        <h3 h-dom:text="skill.skills[i].name"></h3>
    </div>
</div>

<!-- or defined your own index variable -->
<div h-run:for="skill in skills;x=index" id="skills__cards">
    <div id="skills__card">
        <h3 h-dom:text="skill.skills[x].name"></h3>
    </div>
</div>
```

You can also decalare variables.

```html

<div h-run:for="skill in skills;myVar='hi'" id="skills__cards">
    <div id="skills__card">
        <h3 h-dom:text="myVar"></h3>
    </div>
</div>

<!-- you can also retrieve the value of a declared variable  -->
<section h-dom:data={a:1}>
    <h-script>
        const b = 2;
        return b;
    </hscript>

    <div h-run:for="id in your_list;x=index one=a two=$b" id="skills__cards">
        <div id="skills__card">
            <h3 h-dom:text="id,x,one,two"></h3>
        </div>
    </div>
</section>
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
