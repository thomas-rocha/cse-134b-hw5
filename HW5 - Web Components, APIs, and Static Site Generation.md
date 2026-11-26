## Overview

Let’s recap what you’ve done so far.

- **Homework 1:** You explored how websites work, published a simple site, and considered how people with different needs use the web.
- **Homework 2:** You built the foundation of your portfolio with semantic HTML and experimented with custom elements.
- **Homework 3:** You styled your portfolio with CSS, making choices about typography, color, spacing, and responsive layout.
- **Homework 4:** You used JavaScript to enhance a contact form, add theme switching, and explore view transitions.

In Homework 5, you’ll bring those skills together by building a small Web Component for your portfolio. 

You’ll create and update elements inside the component and use a button on the surrounding page to change one of its attributes. The component will respond with a **visible** change. A custom element is part of the DOM, so you can select and manipulate it using the same methods you use for other HTML elements. You’ll also use CSS custom properties to tie the component’s appearance to your portfolio’s theme.

You’ll build on the preference saving you used in Homework 4. Use `localStorage` to remember one preference for your component, such as whether it appears in compact or expanded mode. Restore that choice after a reload and keep the control working for the current page if browser storage is unavailable.

Your component will fetch data from a web API and display it without reloading the page. 

Think through what the visitor wants to do, what data the component needs, and what the visitor sees while a request is loading, after it succeeds, or if it fails. Keep the rest of the portfolio usable when the live feature is unavailable. We’ll give you a few APIs to choose from, so have some fun with it and feel free to show off your personality!

In a short, separate exercise, we're going to lay the groundwork for using a static site generator to build pages that share a section such as a footer. An SSG can help pages load quickly and make it easier to create new pages from a shared template.

## Learning Outcomes

- Students will register a custom element and use DOM methods and event listeners to create and update its content, controls, and status messages.
- Students will use a control outside the component to change an observed attribute and explain how the component responds.
- Students will use `fetch()` to make an asynchronous HTTP request to a REST API endpoint, read its JSON response, and update the page without a full reload.
- Students will check HTTP status, validate the response fields they use, and display remote text safely.
- Students will provide accessible loading, success, and error feedback, demonstrate recovery after a failed request, and verify that the surrounding portfolio remains usable without JavaScript.
- Students will use CSS custom properties to customize the component from the surrounding page and coordinate its appearance with the site’s theme.
- Students will save and restore a component preference using `localStorage` and verify that the control still works when storage is unavailable.
- Students will generate static pages from a shared template or include.
- Students will explain how a visitor’s action changes the component’s state, what data the component needs, and how the interface responds when something goes wrong.

## Setup

- Create a new repository for Homework 5 using a copy of your Homework 4 personal portfolio. Make all Homework 5 changes in the new repository.
- If you clone your Homework 4 repository, check that your local copy points to your new Homework 5 repository before you push. This keeps your Homework 4 submission intact.
- Create a separate deployment for Homework 5. You can use the same hosting service you used for Homework 4. Make sure course staff can access the deployed site and find your Web Component from the portfolio.
- Keep the static site generator exercise in a separate folder within your Homework 5 repository. The portfolio remains the main site for your Homework 5 deployment.
- Test your portfolio through a local web server or your deployed site. Verify that the API request works and your `localStorage` preference survives a page reload.
- If your earlier homework deployments are still running, you’re welcome to take them down. Keep the earlier repositories accessible and leave your Homework 5 deployment available for grading.

## Introducing Web Components

In Homework 2, you experimented with custom elements. Now you’ll give one its own interface and behavior. A **Web Component** is a reusable piece of a web page built with browser features. You can give it a custom HTML tag, such as `<study-note>`, and use JavaScript to define what it displays and how it responds to changes.

A `<study-note>` could show a reminder and reveal a tip when you click a button. A `<project-card>` could display a project’s name and image, then expand to show more details. A `<weather-panel>` could show the current temperature for a selected city and update when you choose a different one.

### Explore some examples

- Browse [WebComponents.org](https://www.webcomponents.org/) to find components shared by other developers.
- Try the expandable panel in the [Shoelace Details demo](https://shoelace.style/components/details). Look at its HTML example and see how the `summary` attribute sets the label shown to the visitor.

As you browse, pick one component and identify its tag name, one attribute you can set, and what the visitor can do with it. You’ll make those same decisions when designing your own component.

### Define and use a custom element

A custom element’s name includes a hyphen. The JavaScript class defines its behavior, and `customElements.define()` tells the browser which class belongs to the tag. In this example, the browser calls `connectedCallback()` when the element is connected to the page. [MDN’s guide to custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements)

Try putting this example in an HTML file and opening it in your browser.

```html
<study-note></study-note>

<script>
  class StudyNote extends HTMLElement {
    connectedCallback() {
      this.textContent = "Remember to test with the keyboard.";
    }
  }

  customElements.define("study-note", StudyNote);
</script>
```

Once the element is on the page, you can select it with `document.querySelector()` and change its attributes just like any other HTML element. In Part 1, you’ll use a button outside your component to change an attribute that the component watches. That change will update what the visitor sees.

## Part 1 - Build a Web Component (25 pts)

Build a small Web Component for your portfolio. Think of one thing a visitor should be able to do with it, such as browsing facts or switching between sample weather reports. Use local sample data for this part. In Part 2, you’ll connect the same interface to a web API.

### Getting started with the DOM

The **Document Object Model (DOM)** is the browser’s representation of a page as a tree of elements. JavaScript can find an element in that tree, change its text, or add new elements. For example, when a visitor activates a button, an event listener can update a paragraph on the page.

Try this in a separate HTML file before building your component. Open the file in your browser and predict what will happen when you activate the button.

```html
<button type="button" id="show-message">Show message</button>
<div id="messages"></div>

<script>
  const button = document.querySelector("#show-message");
  const messages = document.querySelector("#messages");

  button.addEventListener("click", () => {
    const message = document.createElement("p");
    message.textContent = "You activated the button.";
    messages.appendChild(message);
  });
</script>
```

The first two lines of JavaScript find elements that are already on the page. The listener creates a new paragraph, sets its text, and adds it to the message area. Try activating the button twice. Then see if you can change the example to update one paragraph each time.

- **Understand the page structure.** See how HTML becomes a tree that JavaScript can work with. [MDN’s introduction to the document object model](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#the_document_object_model)
- **Learn how buttons trigger code.** Follow an example that uses `addEventListener()` to respond to a click. [MDN’s introduction to events](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Events)
- **Practice creating elements.** Try the shopping list exercise to see how input and buttons can add and remove elements. [MDN’s dynamic shopping list exercise](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#creating_a_dynamic_shopping_list)

#### Using AI to learn the DOM

Give the AI a small task, share the relevant HTML and JavaScript, and say what you want to understand. Try prompts like these:

- **Learn a concept.** “I’m new to the DOM. Using the button example above, walk me through what happens when I click it. Ask me to predict what happens on the second click before you explain.”
- **Implement one step.** “I have an array of sample facts and a paragraph for displaying the current fact. Help me write just the click handler that shows the next fact. Explain which variable tracks the current item and which line updates the DOM.”
- **Debug your code.** “Clicking my button does nothing. Here’s my HTML, my event listener, and the first error from the browser console. Give me one thing to check first and explain what it will tell me.”

Before using a suggestion, predict what the code will do. Try it in the browser, check what actually happens, and make sure you can explain which element changes and why.

Remember, you won’t have AI assistance on the final exam, so practice writing the syntax regularly to build muscle memory.

### Create and update the interface

Define a class that extends `HTMLElement` and register it with `customElements.define()` using a tag name that includes a hyphen. Place the custom element on a portfolio page and load its JavaScript from an external file.

Use DOM methods to create the component’s interface, including a heading, a place to display the current item, a control, and a status message. Use at least two sample items stored in JavaScript. Add an event listener to a control inside the component so the visitor can switch items. Update the displayed content and status without reloading the page. For example, a fact panel could show the next fact and update its status to “Fact 2 of 3.”

Start with `document.createElement()` to create an element, `textContent` to set its text, and `appendChild()` to add it to your component. Try creating one paragraph first, then use the same pattern to build the rest of your interface. [MDN walkthrough on creating and placing new nodes](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/DOM_scripting#creating_and_placing_new_nodes)

### Control the component from the page

Add a native button outside the custom element. When the visitor activates it, use a DOM method such as `toggleAttribute()` to change an attribute on the custom element itself.

List that attribute in `observedAttributes` and use `attributeChangedCallback()` to update the component when the attribute changes. Make the effect visible in both states. For example, toggling a `compact` attribute could hide or reveal extra details about the current item. [MDN example on responding to attribute changes](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes)

Test both controls using the keyboard. Switch the displayed item, toggle the attribute in both directions, and check that the component still shows the selected item after the toggle.

| Requirement | Details | Points |
| --- | --- | --- |
| Custom element registration and integration | Register a custom element and make it easy to find on the portfolio. The component displays its initial interface when the page loads. | 5 |
| DOM rendering and interaction | Use DOM methods to build the interface. The final submission can demonstrate this with live data. An internal control updates the displayed item and status without a page reload. | 10 |
| Observed attribute and page control | An external button changes an observed attribute on the custom element. The component responds visibly when the attribute changes in either direction. Both controls work by keyboard. | 10 |
| **Total** | | **25** |

## Part 2 - Connect It to a Web API (35 pts)

In Part 1, your component displayed sample data from JavaScript. Now use the same interface to display data requested over the network. A visitor should be able to request an update from inside your component and see the result without reloading the page.

For your final submission, the live component can demonstrate the Part 1 DOM and control requirements. A separate sample-data demo is optional.

### Make your first request

An **API endpoint** is a URL that accepts a request for a particular resource. In this part, you’ll use an HTTP `GET` request to retrieve data. You may hear this kind of background request called **AJAX**. The browser can make the request while the page remains open, and the response can be JSON.

Start with a small practice example. Save the following as `sample.json` beside a practice HTML file and serve both files through your local web server.

```json
{ "message": "The practice request worked." }
```

Add this script to your practice HTML file. Open the browser console to see the result.

```html
<script>
  // An async function can use await to wait for results.
  async function loadMessage() {
    
    // Run these steps in order. If one throws an error, jump to catch.
    try {
      
      // Send a GET request for sample.json in the same folder as this page.
      // Wait for the server to return a response before continuing.
      const response = await fetch("./sample.json");
      
      // Even an HTTP error such as 404 returns a response. Check its status.
      if (!response.ok) {
        
        // Stop here and pass the status code to the catch block.
        throw new Error(`HTTP status ${response.status}`);
      }

      // Read the response body and parse the JSON into a JavaScript value.
      const data = await response.json();
      
      // Check that message contains text. The ?. lets us check safely
      // even if the parsed response is null.
      if (typeof data?.message !== "string") {
        
        // Send an unexpected response to the same error handler.
        throw new Error("Expected a message in the response.");
      }
      
      // The response passed both checks. Show the message in the Console.
      console.log(data.message);
    } catch (error) {
      
      // Report the failure and its cause, such as a network error or invalid JSON.
      console.error("Could not load the message.", error);
    }
  }

  // Call the function to start the request when the browser runs this script.
  loadMessage();
</script>
```

`await` pauses the function while the request or JSON parsing finishes. Check `response.ok` because a server response such as `404` can still produce a response object. Try changing the filename, then restore it and see what changes in the Console and Network panels. [MDN’s guide to using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)

### Choose an API and connect your component

Choose one of these options. Open the example endpoint and identify the fields you want to display before changing your component.

- **Useless Facts.** Display a random fact or today’s fact. You could add a labeled select menu to choose between the two. [API documentation](https://uselessfacts.jsph.pl/) · [Random fact endpoint](https://uselessfacts.jsph.pl/api/v2/facts/random)
- **Cat Facts.** Make a “Tell me something about cats” button. Read the `fact` field to get the text. [Random cat fact endpoint](https://catfact.ninja/fact)
- **Dad Jokes.** Make a “Make me groan” button. Request JSON with the `Accept: application/json` header and display the `joke` field. [Dad Joke API documentation and JSON example](https://icanhazdadjoke.com/api#fetch-a-random-dad-joke)
- **Dog CEO.** Make a “Surprise me with a dog” button. The `message` field contains an image URL. Check that it’s a valid HTTPS URL before assigning it to an image with appropriate alt text. [Random dog image endpoint](https://dog.ceo/api/breeds/image/random)

Connect a control inside your component to a request function. Read the JSON response and check that the fields you use have the expected types before updating the page. Put remote text into elements with `textContent`. Keep the page button from Part 1 working after a data update.

### Handle loading, success, and failure

Use a visible status area that assistive technology can announce, such as an existing element with `role="status"`. Update it when a request starts, succeeds, or fails. Give the visitor a way to try again after a failure. If a control is disabled while a request is pending, restore it after either outcome.

Verify these behaviors on your portfolio.

1. Use the component’s control to request live data and check the request in the Network panel. Confirm that the displayed result comes from the response.
2. Use the Network panel’s offline setting after the page loads, then request data again. Confirm that the component reports the failure and the portfolio remains usable.
3. Restore the connection and retry without reloading the page. Confirm that the result appears and the error message clears.

| Requirement | Details | Points |
| --- | --- | --- |
| Live request and DOM update | A component control requests JSON from the chosen API with `fetch()` and updates the displayed content without a page reload. The Part 1 page button still works. | 15 |
| Defensive response handling | Check HTTP status and the fields used. Handle network and parsing failures and render remote text safely. | 10 |
| Accessible feedback and recovery | Communicate loading, success, and failure. Demonstrate that the component can recover through a successful retry without a page reload. | 10 |
| **Total** | | **35** |

## Part 3 - Theme the Component and Save a Preference (25 pts)

In Homework 4, you used CSS custom properties to switch your portfolio’s theme and `localStorage` to remember the visitor’s choice. Now apply those techniques to the Web Component you built in Parts 1 and 2.

### Theme your component

Use CSS custom properties for at least two aspects of the component’s appearance, such as its background and text colors. Give the properties usable fallback values. Set the properties from your portfolio stylesheet and show how the component fits both of your existing themes.

This example shows how the surrounding page can pass a color to a component. Use your own selectors and theme variables.

```css
/* In the portfolio stylesheet, pass the site's color to the custom element. */
fact-panel {
  --panel-background: var(--page-background, white);
}

/* In the component's styles, read that value and supply a fallback. */
.panel {
  background-color: var(--panel-background, white);
}
```

Here, `.panel` is an element inside `<fact-panel>`. Custom properties inherit from the custom element to its descendants, including elements inside its shadow tree if you use Shadow DOM.

### Remember one component preference

Use `localStorage` to save one choice about how the component works or looks. For example, reuse the button from Part 1 to save whether the component is in compact or expanded mode. Use a key specific to your component, such as `hw5-fact-panel-mode`, so the preference has its own place alongside the site theme.

1. When the visitor uses the control, apply the change immediately. Then save the new value with `localStorage.setItem()`.
2. When the page loads, read the saved value with `localStorage.getItem()`. Check that it’s one of the values you expect. Use your default when there is no saved value or the value is unrecognized.
3. Apply the restored choice through the same path as the control. For compact mode, that means setting or removing the observed attribute and letting the component respond. Keep the control’s label or state consistent with the restored choice.
4. Use `try`/`catch` around storage reads and writes. If reading fails, start with the default. If saving fails, the visitor’s choice should still take effect for the current page.

### Verify the experience

- Switch between both portfolio themes. Check that the component’s text, controls, and focus indicators remain easy to see.
- Use the preference control with the keyboard, reload on the same site, and confirm that the choice is restored. Change it back and reload again.
- Test the read and write failure paths. For example, temporarily throw an error inside the storage `try` blocks, one at a time, then remove the test errors. Confirm that the component still works and the control still changes the preference for the current page.
- Disable JavaScript and reload. Check that the portfolio’s main content and navigation are still usable and that the widget has a clear fallback. For example, use a `<noscript>` message near the widget that says “Enable JavaScript to load live data for this widget.” Re-enable JavaScript and verify that the API control from Part 2 still works.

| Requirement | Details | Points |
| --- | --- | --- |
| CSS custom properties and theme integration | Use at least two customizable properties with fallbacks. Set them from the surrounding page and keep the component readable in both portfolio themes. | 10 |
| Preference persistence and storage failures | Save and restore one component preference. Use a default when reading fails or the saved value is unusable, and keep the control working when writing fails. | 10 |
| Keyboard operation and fallback | Verify keyboard operation and visible focus. Keep the main portfolio usable with JavaScript disabled and provide a clear fallback for the widget. | 5 |
| **Total** | | **25** |

## Part 4 - Generate Pages with a Shared Section (15 pts)

If you copy the same footer into several HTML files, a change to that footer means editing every page. A **static site generator (SSG)** lets you write the footer once and use it on multiple pages. When you build the site, the generator combines each page’s content with the shared footer and produces HTML files.

### Choose a generator

Use **Astro or Eleventy** for this exercise. Set up the project in a separate folder inside your Homework 5 repository, such as `ssg-exercise/`. Continue to use your existing portfolio as the main Homework 5 deployment.

- **Astro.** Follow the setup and page creation steps from the official tutorial. Create an Astro component for your shared section and import it into both pages or into a layout both pages use. [Astro setup tutorial](https://docs.astro.build/en/tutorial/1-setup/) · [Astro shared footer example](https://docs.astro.build/en/tutorial/3-components/2/)
- **Eleventy (11ty).** Follow the getting started guide, then use a shared include or layout for both pages. Choose a templating approach that works for you. Nunjucks is one option, and WebC is another if you want to try writing reusable sections with component-like markup. [Eleventy getting started guide](https://www.11ty.dev/docs/) · [Eleventy layouts](https://www.11ty.dev/docs/layouts/) · [Optional WebC documentation](https://www.11ty.dev/docs/languages/webc/)

### Build two pages and verify the shared section

1. Choose two pages you’ve already built for your portfolio, such as Home and About. Copy them into your SSG exercise folder and adapt the copies so your generator can build them. Keep each page’s heading and main content, and bring over any styles or assets those pages need.
2. Write one shared section, such as a footer, in its own component, include, or layout. Use it on both pages.
3. Run the generator’s build command and preview both pages locally. Confirm that each page shows its own content and the shared section.
4. Change the shared section in one place, rebuild, and refresh both pages. Confirm that both pages show the change.
5. Keep the source files and project configuration in the exercise folder. Add a short README with the commands to install dependencies, build the exercise, and preview both pages locally.

| Requirement | Details | Points |
| --- | --- | --- |
| Two generated pages | Astro or Eleventy builds two pages from your existing portfolio in the separate exercise project. Each page retains its own main content. | 5 |
| Shared section | Both pages use the same component, include, or layout for a shared section. Editing its source in one place updates both pages after rebuilding. | 7 |
| Build and preview instructions | The exercise includes its source and project configuration, with clear instructions for building and previewing both pages. | 3 |
| **Total** | | **15** |

## Deliverables

Upload one plain-text file named `links.txt` to Gradescope. Put one complete HTTPS URL on each line in this order. Use plain URLs without labels or Markdown formatting.

```text
https://github.com/your-username/your-hw5-repo
https://your-hw5-site.example/
https://your-hw5-site.example/projects.html
```

1. **Repository URL.** Link to the root of your Homework 5 repository. Include the portfolio source and assets, the Web Component code, and the separate SSG exercise with its source and configuration.
2. **Deployed portfolio URL.** Link to the home page of your Homework 5 site.
3. **Component page URL.** Link directly to the deployed page that contains your working Web Component. If the component is on your home page, repeat the home page URL on this line.

In the repository’s root README, give the path to the SSG exercise folder and identify the two pages to preview. Include the commands to install dependencies, build the exercise, and preview it locally in the exercise README.

Include a short design note in your repository README. Identify what a visitor wants to accomplish and trace one action, such as requesting new data, from the control through any API request it triggers to the resulting DOM update. Explain what the visitor sees while waiting, on success, and if the request fails.


## Conclusion

Congratulations! Here's what you've done in this assignment:

- Built a Web Component with sample data and connected it to a live API.
- Used CSS custom properties to fit the component into your portfolio’s theme and `localStorage` to remember a visitor’s preference.
- Adapted two existing portfolio pages so one edit to their shared section updates both when you rebuild.
