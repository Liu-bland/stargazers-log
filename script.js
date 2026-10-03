const repositoryList = document.querySelector("#repository-list");
const repositoryCount = document.querySelector("#repository-count");

function renderRepositories(repositories) {
  repositoryList.replaceChildren();
  repositoryCount.textContent = `${repositories.length} ${repositories.length === 1 ? "repository" : "repositories"}`;

  if (repositories.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "status-message";
    emptyMessage.textContent = "No starred repositories yet.";
    repositoryList.append(emptyMessage);
    return;
  }

  for (const repository of repositories) {
    const item = document.createElement("li");
    item.className = "repository-item";

    const link = document.createElement("a");
    link.className = "repository-link";
    link.href = repository.url;
    link.textContent = repository.name;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const description = document.createElement("p");
    description.className = "repository-description";
    description.textContent = repository.description;

    const date = document.createElement("time");
    date.className = "repository-date";
    date.dateTime = repository.starred_at;
    date.textContent = `Starred ${new Date(`${repository.starred_at}T00:00:00`).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`;

    item.append(link, description, date);
    repositoryList.append(item);
  }
}

fetch("events.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return response.json();
  })
  .then(renderRepositories)
  .catch(() => {
    repositoryList.replaceChildren();
    const errorMessage = document.createElement("li");
    errorMessage.className = "status-message";
    errorMessage.textContent = "Could not load repositories. Please try again later.";
    repositoryList.append(errorMessage);
  });