







<figure>
	<img src='/img/components/file-tabs/rwt-file-tabs.png' width='100%' />
	<figcaption></figcaption>
</figure>

# File Tabs

## For multitasking UI/UX


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-05-04>May 4, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-file-tabs</span> web component is a thin bar containing named file tabs. It is typically used with apps that allow multiple files to be worked on simultaneously.</td></tr>
</table>

### Motivation

The <span>rwt-file-tabs</span> web component can be used in scenarios
with multiple views or multiple work tasks.

This component can be configured with a fixed set of tabs which are slotted into
the component when designing the document. Alternatively, its programming API
allows tabs to be created and removed as needed, when working with a dynamic set
of tabs.

Tabs can be configured using CSS to adjust their size and typography.

The tab bar occupies a fixed width. When the size of all tabs exceeds that
width, scroll buttons are automatically enabled.

Dynamic tabs can be <q>closable</q> or not, based on an attribute set on
the web component by the developer.

#### Prerequisites

The <span>rwt-file-tabs</span> web component works in any browser that
supports modern W3C standards. Templates are written using  notation, which can
be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-file-tabs
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the web component using the command:
```bash
npm install rwt-file-tabs
```


Important note: This web component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The web component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-file-tabs</span> web component into it using the
      command:
```bash
git clone https://github.com/readwritetools/rwt-file-tabs.git
```


### Using the web component

After installation, you need to add a few things to your HTML page to make use
of it.

   * Add a `script` tag to load the component's `rwt-file-tabs.js` file:
```html
<script src='/node_modules/rwt-file-tabs/rwt-file-tabs.js' type=module></script>
```

   * Add the component tag somewhere on the page, configuring it with two optional
      attributes:

      * `closable` This optional attribute instructs the component to add an 'x' button to
         each dynamically added tab, allowing the user to remove the tab.
      * `role=navigation` This web accessible ARIA attribute tells readers that the
         component is used for navigation.

### Slotted usage

If the component is to be used with a predetermined set of tabs, they can be
slotted in. Here's an example:

```html
<rwt-file-tabs role=contentinfo>
    <button slot=tabitem id=tab1 title='Read only view'>READ</button>
    <button slot=tabitem id=tab2 title='Text editing view'>WRITE</button>
    <button slot=tabitem id=tab3 title='Web browser preview'>PREVIEW</button>
</rwt-file-tabs>
```

### Programmatic API

If the component is to be used with a dynamic set of tabs, they can be added and
removed using these methods.


<dl>
	<dt><code>insertTab(id, value, title)</code></dt>
	<dd>The <code>id</code> should be a unique identifier. It will be used for manipulating the tab.</dd>
	<dd>The <code>value</code> is the text to display on the tab. Text that is too long will be ellipsed.</dd>
	<dd>The <code>title</code> parameter is optional, and if provided will be used as the hover tooltip.</dd>
	<dt><code>removeTab(id)</code></dt>
	<dd>The <code>id</code> is the identifier of the tab to remove.</dd>
	<dt><code>getCurrentTab()</code></dt>
	<dd>Returns an object with two values: <code>currentTabId</code> and <code>currentTabValue</code>.</dd>
	<dt><code>setCurrentTab(id)</code></dt>
	<dd>Changes the current tab to be the one identified with <code>id</code>.</dd>
</dl>

### Events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used.</dd>
	<dt><code>tab-activated</code></dt>
	<dd>Sent when the user switches to a new tab. The <code>event</code> argument has a <code>detail</code> property containing the <code>currentTabId</code> and <code>currentTabValue</code> of the newly activated tab.</dd>
	<dt><code>tab-closing</code></dt>
	<dd>Sent when the user clicks on the 'x' to close a tab. This event allows the developer to determine if it's safe to close the tab. Use <code>preventDefault()</code> to cancel the operation. The <code>event</code> argument has a <code>detail</code> property containing the <code>currentTabId</code> and <code>currentTabValue</code> of the item about to be closed.</dd>
</dl>

### Styling

#### Tab styling

The component can be styled with these CSS variables:

```css
rwt-file-tabs {
    --width: 100%;
    --height: 2rem;
    --nav-button-size: 1.6rem;
}
```

The tabs can be styled with these CSS variables:

```css
rwt-file-tabs {
    --font-weight: normal;
    --letter-spacing: 0px;
    --text-align: left;
    --min-width: 2rem;
    --max-width: 6rem;    
}
```

#### Dialog color scheme

The default color palette for the component uses a dark mode theme. You can use
CSS to override the variables' defaults:

```css
rwt-file-tabs {
    --color: var(--white);
    --accent-color1: var(--pure-white);
    --background: var(--black);
    --accent-background1: var(--pure-black);
    --accent-background2: var(--nav-black);
    --accent-background3: var(--medium-black);
    --accent-background4: var(--gray);
}
```

### License

The <span>rwt-file-tabs</span> web component is licensed under the MIT
License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-file-tabs'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-file-tabs'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/file-tabs.blue'>Read Write Hub</a></td></tr>
</table>

