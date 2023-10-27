window.addEventListener("load", (event) => {
  fetchExternalData();
});

const fetchExternalData = () => {
  const tableDataset = document.querySelector("#info-table");

  if (tableDataset) {
    const tableContainer = document.querySelector(".external-data-div");

    getExternalData()
      .then((response) => response.json())
      .then((json) => {
        const recievedData = json;
        for (const item of recievedData) {
          const tr = tableDataset.insertRow();

          const imageCell = tr.insertCell(0);
          var image_ = document.createElement("img");
          image_.src = item.thumbnailUrl;
          image_.alt = "Alternate text.";
          imageCell.className = "image-cell-data";
          imageCell.appendChild(image_);

          const idCell = tr.insertCell(1);
          idCell.className = "id-cell-data";
          idCell.textContent = item.id;

          const titleCell = tr.insertCell(2);
          titleCell.textContent = item.title;
          titleCell.className = "title-cell-data";

          const urlCell = tr.insertCell(3);
          urlCell.className = "url-cell-data";
          urlCell.textContent = item.url;
        }
        tableContainer.style.display = "flex";
      });
  }
};

const getExternalData = () => {
  return fetch("https://jsonplaceholder.typicode.com/photos?albumId=1");
};
