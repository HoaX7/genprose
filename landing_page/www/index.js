const stepper = document.getElementById("stepper");

if (stepper) {
  const steps = ["Paste your link", "Get your content", "Publish your blog"];
  steps.map((item) => {
    const divEl = document.createElement("div");
    divEl.classList.add("flex", "items-center");
    divEl.innerHTML = `<span class="shadow-lg flex items-center justify-center bg-indigo-600 w-7 h-7 rounded-full">
        <svg aria-hidden="true" class="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
        </span> <span class="shadow-lg ml-1 text-base bg-indigo-600 text-green-300 px-3 py-1 font-semibold rounded-full">
        ${item}
        </span>`;
    stepper.appendChild(divEl);
  });
}

const howItWorks = document.getElementById("how-it-works");
if (howItWorks) {
  const howItWorksContent = [
    {
      pill: "ctrl + c",
      description:
        "Copy the link of the video or the podcast episode or even a webinar.",
    },
    {
      pill: "ctrl + v",
      description:
        "Paste it in <span class='font-semibold'>Gen Prose</span> and select your content style preferences.",
    },
    {
      pill: "⚡️",
      description: "Get your content and publish in your blog.",
    },
  ];

  howItWorksContent.map((item) => {
    const liEl = document.createElement("li");
    liEl.classList.add("mt-5");
    liEl.innerHTML = `<span class="rounded-full bg-indigo-600 py-1 px-3">${item.pill}</span> ${item.description}`;
    howItWorks.appendChild(liEl);
  });
}

const ourStory = document.getElementById("our-story");
if (ourStory) {
  const content = [
    "Coming up with content ideas for a business is a time consuming task. Create a good volume of relevant content is even more tedious.",
    "Your employees, clients or even your competitors have great ideas that could potentially become a source of your content.",
    "We created <span class='font-semibold'>Gen Prose</span> to generate SEO optimized content from the content that are locked in audio and video forms.",
    "Now you can create content from a relevant youtube video, podcast, webinars, internal meetings, zoom recordings and more.",
    "Instead of you spending hours to create repurposed or derived content, let GenProse handle it. You paste the link and we give the content. You get to customize the content if you don’t like it.",
    "Save 100+ hours of your time and focus on unique content. Let GenProse handle the auxiliary content.",
  ];

  content.map((it) => {
      const pEl = document.createElement("p")
      pEl.classList.add("mt-3")
      pEl.innerHTML = it
      ourStory.appendChild(pEl)
  })
}

const joinWaitlistLoader = document.getElementById("audio-wave-loader")
if (joinWaitlistLoader) {
    const divEl = document.createElement("div")
    divEl.classList.add("boxContainer", "-mr-2", "z-10")
    const iter = [1, 2, 3, 4, 5]
    iter.map(it => {
        const childEl = document.createElement("div")
        childEl.classList.add("bg-indigo-600", "box", `box${it}`)
        childEl.setAttribute("key", `box_${it}`)
        divEl.appendChild(childEl)
    })
    joinWaitlistLoader.appendChild(divEl)
    const divEl2 = document.createElement("div")
    divEl2.classList.add("border-2", "border-white", "px-1", "w-10", "rounded-md", "loader-line-container")
    const iter2 = [1, 2, 3, 4, 5, 6]
    iter2.map(it => {
        const childEl = document.createElement("div")
        childEl.setAttribute("key", `content_list_${it}`)
        childEl.classList.add("my-1", "before:bg-indigo-600", "loader-line", "rounded", `loader-line-box${it}`)
        divEl2.appendChild(childEl)
    })
    joinWaitlistLoader.appendChild(divEl2)
}