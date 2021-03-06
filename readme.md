












<figure>
	<img src='/img/components/file-tabs/file-tabs-1500x750.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

##### Premium DOM Component

# File Tabs

## For multitasking UI/UX


<address>
<img src='/img/48x48/rwtools.png' /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-05-04>May 4, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-file-tabs</span> DOM component is a thin bar containing named file tabs. It is typically used with apps that allow multiple files to be worked on simultaneously.</td></tr>
</table>

### Motivation

The <span>rwt-file-tabs</span> DOM component can be used in scenarios
with multiple views or multiple work tasks.

This component can be configured with a fixed set of tabs which are slotted into
the component when designing the document. Alternatively, its programming API
allows tabs to be created and removed as needed, when working with a dynamic set
of tabs.

Tabs can be configured using CSS to adjust their size and typography.

The tab bar occupies a fixed width. When the size of all tabs exceeds that
width, scroll buttons are automatically enabled.

Dynamic tabs can be <q>closable</q> or not, based on an attribute set on
the DOM component by the developer.

#### In the wild

To see an example of this component in use, visit the <a href='https://fiddle.blue/BP-AZB-DIAAH'><span class=bp>BLUE</span><span class=phrase>FIDDLE</span></a>
website. It uses two components: one vertical and one horizontal. To understand
what's going on under the hood, use the browser's inspector to view the HTML
source code and network activity, and follow along as you read this
documentation.

### Installation

#### Prerequisites

The <span>rwt-file-tabs</span> DOM component works in any browser that
supports modern W3C standards. Templates are written using <span>BLUE</span><span>
PHRASE</span> notation, which can be compiled into HTML using the free <a href='https://hub.readwritetools.com/desktop/rwview.blue'>Read Write View</a>
desktop app. It has no other prerequisites. Distribution and installation are
done with either NPM or via Github.

#### Download


<details>
	<summary>Download using NPM</summary>
	<p><b>OPTION 1:</b> Familiar with Node.js and the <code>package.json</code> file?<br />Great. Install the component with this command:</p>
	<pre lang=bash>
npm install rwt-file-tabs<br />	</pre>
	<p><b>OPTION 2:</b> No prior experience using NPM?<br />Just follow these general steps:</p>
	<ul>
		<li>Install <a href='https://nodejs.org'>Node.js/NPM</a> on your development computer.</li>
		<li>Create a <code>package.json</code> file in the root of your web project using the command:</li>
		<pre lang=bash>
npm init<br />		</pre>
		<li>Download and install the DOM component using the command:</li>
		<pre lang=bash>
npm install rwt-file-tabs<br />		</pre>
	</ul>
	<p style='font-size:0.9em'>Important note: This DOM component uses Node.js and NPM and <code>package.json</code> as a convenient <i>distribution and installation</i> mechanism. The DOM component itself does not need them.</p>
</details>


<details>
	<summary>Download using Github</summary>
	<p>If you prefer using Github directly, simply follow these steps:</p>
	<ul>
		<li>Create a <code>node_modules</code> directory in the root of your web project.</li>
		<li>Clone the <span class=product>rwt-file-tabs</span> DOM component into it using the command:</li>
		<pre lang=bash>
git clone https://github.com/readwritetools/rwt-file-tabs.git<br />		</pre>
	</ul>
</details>

### Using the DOM component

After installation, you need to add a few things to your HTML page to make use
of it.

   * Add a `script` tag to load the component's `rwt-file-tabs.js` file:
```html
<script src='/node_modules/rwt-file-tabs/rwt-file-tabs.js' type=module></script>
```

   * Add the component tag somewhere on the page, configuring it with these optional
      attributes:

      * `closable` This optional attribute instructs the component to add an 'x' button to
         each dynamically added tab, allowing the user to remove the tab.
      * `scroll-side={left|right}` When the space occupied by the tabs is too large,
         scroll buttons are enabled. They can be positioned to the `left` or the `right` of
         the tabs.
      * `anchor-side={left|right}` When the space occupied by the tabs is less than the
         width of the component, the unoccupied space can be anchored to the `left` or to
         the `right` of the tabs.
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
	<dt><code>getScrollableOverflow()</code></dt>
	<dd>The size, in pixels, of the tabs that are hidden when the component isn't wide enough for all of them.</dd>
	<dt><code>setScrollPosition(left)</code></dt>
	<dd>The <code>left</code> parameter is the number of pixels to programmatically scroll the tabs. It should be an integer from 0 to <code>scrollableOverflow</code>.</dd>
	<dt><code>scrollMaxRight()</code></dt>
	<dd>Scroll the tabs all the way to the right. This is only meaningful when there is scrollable overflow.</dd>
</dl>

### Life-cycle events

The component issues life-cycle events.


<dl>
	<dt><code>component-loaded</code></dt>
	<dd>Sent when the component is fully loaded and ready to be used. As a convenience you can use the <code>waitOnLoading()</code> method which returns a promise that resolves when the <code>component-loaded</code> event is received. Call this asynchronously with <code>await</code>.</dd>
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

### Vertically oriented tabs

The component can be oriented vertically by wrapping it in a positioned element
and using a CSS transform.  Here's an example of how to do it:

#### HTML

```html
<div id=viewtabs-area>         
    <rwt-file-tabs id=viewtabs scroll-side=left anchor-side=right>
        <button id=id4 slot=tabitem title='Delta view'>Delta</button>
        <button id=id3 slot=tabitem title='Gamma view'>Gamma</button>
        <button id=id2 slot=tabitem title='Beta view'>Beta</button>
        <button id=id1 slot=tabitem title='Alpha view'>Alpha</button>
    </rwt-file-tabs>
</div>
```

#### CSS

```css
div#viewtabs-area {
    position: absolute;
    top: 2.3rem;
    left: 0;
    bottom: 0;
    width: 2.0rem;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
}
#viewtabs {
    position: absolute;
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 34rem; /* JavaScript will override */
    top: 34rem;   /* JavaScript will override */
}
```

#### JavaScript

```js
function onResize() {
    var viewTabsArea = document.getElementById('viewtabs-area');
    var viewTabs = document.getElementById('viewtabs');
    var height = viewTabsArea.offsetHeight;
    viewTabs.style.width = `${height}px`;
    viewTabs.style.top = `${height}px`;
}

window.addEventListener('resize', onResize);
```

---

### Reference


<table>
	<tr><td><img src='/img/48x48/read-write-hub.png' alt='DOM components logo' width=48 /></td>	<td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/file-tabs.blue'>READ WRITE HUB</a></td></tr>
	<tr><td><img src='/img/48x48/git.png' alt='git logo' width=48 /></td>	<td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-file-tabs'>github</a></td></tr>
	<tr><td><img src='/img/48x48/dom-components.png' alt='DOM components logo' width=48 /></td>	<td>Component catalog</td> 	<td><a href='https://domcomponents.com/components/file-tabs.blue'>DOM COMPONENTS</a></td></tr>
	<tr><td><img src='/img/48x48/npm.png' alt='npm logo' width=48 /></td>	<td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-file-tabs'>npm</a></td></tr>
	<tr><td><img src='/img/48x48/read-write-stack.png' alt='Read Write Stack logo' width=48 /></td>	<td>Publication venue</td>	<td><a href='https://readwritestack.com/components/file-tabs.blue'>READ WRITE STACK</a></td></tr>
</table>

### License

The <span>rwt-file-tabs</span> DOM component is not freeware. After
evaluating it and before using it in a public-facing website, eBook, mobile app,
or desktop application, you must obtain a license from <a href='https://readwritetools.com/licensing.blue'>Read Write Tools</a>
.

<img src='/img/blue-seal-premium-software.png' width=80 align=right />

<details>
	<summary>File Tabs Software License Agreement</summary>
	<ol>
		<li>This Software License Agreement ("Agreement") is a legal contract between you and Read Write Tools ("RWT"). The "Materials" subject to this Agreement include the "File Tabs" software and associated documentation.</li>
		<li>By using these Materials, you agree to abide by the terms and conditions of this Agreement.</li>
		<li>The Materials are protected by United States copyright law, and international treaties on intellectual property rights. The Materials are licensed, not sold to you, and can only be used in accordance with the terms of this Agreement. RWT is and remains the owner of all titles, rights and interests in the Materials, and RWT reserves all rights not specifically granted under this Agreement.</li>
		<li>Subject to the terms of this Agreement, RWT hereby grants to you a limited, non-exclusive license to use the Materials subject to the following conditions:</li>
		<ul>
			<li>You may not distribute, publish, sub-license, sell, rent, or lease the Materials.</li>
			<li>You may not decompile or reverse engineer any source code included in the software.</li>
			<li>You may not modify or extend any source code included in the software.</li>
			<li>Your license to use the software is limited to the purpose for which it was originally intended, and does not include permission to extract, link to, or use parts on a separate basis.</li>
		</ul>
		<li>Each paid license allows use of the Materials under one "Fair Use Setting". Separate usage requires the purchase of a separate license. Fair Use Settings include, but are not limited to: eBooks, mobile apps, desktop applications and websites. The determination of a Fair Use Setting is made at the sole discretion of RWT. For example, and not by way of limitation, a Fair Use Setting may be one of these:</li>
		<ul>
			<li>An eBook published under a single title and author.</li>
			<li>A mobile app for distribution under a single app name.</li>
			<li>A desktop application published under a single application name.</li>
			<li>A website published under a single domain name. For this purpose, and by way of example, the domain names "alpha.example.com" and "beta.example.com" are considered to be separate websites.</li>
			<li>A load-balanced collection of web servers, used to provide access to a single website under a single domain name.</li>
		</ul>
		<li>THE MATERIALS ARE PROVIDED BY READ WRITE TOOLS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL READ WRITE TOOLS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.</li>
		<li>This license is effective for a one year period from the date of purchase or until terminated by you or Read Write Tools. Continued use, publication, or distribution of the Materials after the one year period, under any of this Agreement's Fair Use Settings, is subject to the renewal of this license.</li>
		<li>Products or services that you sell to third parties, during the valid license period of this Agreement and in compliance with the Fair Use Settings provision, may continue to be used by third parties after the effective period of your license.</li>
		<li>If you decide not to renew this license, you must remove the software from any eBook, mobile app, desktop application, web page or other product or service where it is being used.</li>
		<li>Without prejudice to any other rights, RWT may terminate your right to use the Materials if you fail to comply with the terms of this Agreement. In such event, you shall uninstall and delete all copies of the Materials.</li>
		<li>This Agreement is governed by and interpreted in accordance with the laws of the State of California. If for any reason a court of competent jurisdiction finds any provision of the Agreement to be unenforceable, that provision will be enforced to the maximum extent possible to effectuate the intent of the parties and the remainder of the Agreement shall continue in full force and effect.</li>
	</ol>
</details>

#### Activation

To activate your license, copy the `rwt-registration-keys.js` file to the *root
directory of your website*, providing the `customer-number` and `access-key` sent to
your email address, and replacing `example.com` with your website's hostname.
Follow this example:

<pre>
export default [{
    "product-key": "rwt-file-tabs",
    "registration": "example.com",
    "customer-number": "CN-xxx-yyyyy",
    "access-key": "AK-xxx-yyyyy"
}]
</pre>

