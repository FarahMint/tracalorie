//using module pattern- Each module are an IIFE -> Immediately-invoked function expression

// ===================== Storage Controller ==================================//

const StorageCtrl = (function() {
  // *** Public method
  return {
    storeItem: function(item) {
      let items;
      // Local storage can hold string
      // check if any item in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Pu sh new item
        items.push(item);
        // Set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        //get what is already in local storage
        // parse to get object
        items = JSON.parse(localStorage.getItem("items"));
        // push new item
        items.push(item);
        // Reset loca l storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromLocalStorage: function() {
      let items;
      // Check if there is element in ls
      if (localStorage.getItem("items") === null) {
        //no element -> item empty array
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (updatedItem.id === item.id) {
          // remove it , 1 from index and replace with updateitem
          items.splice(index, 1, updatedItem);
        }
      });
      // reset the local storage
      localStorage.setItem("items", JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem("items"));

      items.forEach((item, index) => {
        if (id === item.id) {
          // remove it , 1 from index
          items.splice(index, 1);
        }
      });
      // reset the local storage
      localStorage.setItem("items", JSON.stringify(items));
    },
    // clear all from ls
    clearItemFromStorage: function() {
      localStorage.removeItem("items");
    }
  }; // END return - Public method
})();

// ===================== Item Controller  ->Ingredients ======================= //

const ItemCtrl = (function() {
  // Item constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // *** Data structure / State
  const data = {
    // items: [
    //   // { id: 0, name: "Steak Dinner", calories: 1200 },
    //   // { id: 1, name: "Cookie", calories: 400 },
    //   // { id: 2, name: "Eggs", calories: 300 }
    // ],

    items: StorageCtrl.getItemsFromLocalStorage(),
    currentItem: null,
    totalCalories: 0
  };
  // *** Public method
  // whatever return from module is going to be pubic
  return {
    // **
    getItems: function() {
      return data.items;
    },
    // **
    addItem: function(name, calories) {
      let ID;
      // need to generate id to identify them
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories parse to number
      calories = parseInt(calories);

      // Create new Item
      newItem = new Item(ID, name, calories);
      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    //** */
    getItemById: id => {
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        // Match ID
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    //**
    updateItem: function(name, calories) {
      // Calories value parsed to num
      calories = parseInt(calories);
      let found = null;
      // Loop through items
      data.items.forEach(function(item) {
        // Match ID to current id (item cliked becomes current id)
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    // **
    setCurrentItem: function(item) {
      // set current item from data structure
      data.currentItem = item;
    },

    getCurrentItem: function() {
      return data.currentItem;
    },

    // **
    getTotalCalories: function() {
      // loop through items and add calories
      let total = 0;
      data.items.forEach(item => {
        total += item.calories;
      });
      // Set totalCalories from data structure
      data.totalCalories = total;
      // return total cal
      return data.totalCalories;
    },
    //** */
    deleteItem: function(id) {
      // get IDs -> map= return something
      const ids = data.items.map(item => {
        return item.id;
      });
      // Get the index
      const index = ids.indexOf(id);
      // remove item
      data.items.splice(index, 1);
    },
    //** */
    clearAllItems: function() {
      data.items = [];
    },

    // **
    logData: function() {
      return data;
    }
  }; // END return - Public method
})();

// ===================== UI Controller =========================================//

const UICtrl = (function() {
  // UISelectors
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    clearBtn: ".clear-btn",
    itemCaloriesInput: "#item-calories",
    itemNameInput: "#item-name",
    totalCalories: ".total-calories"
  };

  // ** Public method
  return {
    // **
    populateItemslist: function(items) {
      let html = "";
      items.forEach(item => {
        html += `
         <li class="collection-item" id="item-${item.id}">
         <strong>${item.name}: </strong> <em> ${item.calories} Calories</em>
         <a href="#" class="secondary-content">
           <i class="edit-item fas fa-pencil-alt"></i>
         </a>
       </li>  
         `;
      }); // End foreach loop

      // Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    // **
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,

        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    // **
    hideList: function() {
      //Hide List
      document.querySelector(UISelectors.itemList).style.display = "none";
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = "block";
    },

    // **
    addListItems: function(newItem) {
      // create li
      const li = document.createElement("li");
      // Add class
      li.className = "collection-items";
      // Add id
      li.id = `item-${newItem.id}`;
      li.innerHTML = `<strong>${newItem.name}: </strong> <em> ${
        newItem.calories
      } Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fas fa-pencil-alt"></i>
      </a>`;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    //** */
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    // **
    updateItem: function(item) {
      // to get all list items -> give node list
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // convert node list to array
      listItems = Array.from(listItems);
      // Loop throuth
      listItems.forEach(listItem => {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
           <strong>${item.name}: </strong> <em> ${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fas fa-pencil-alt"></i>
          </a>`;
        }
      });
    },
    // **
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },

    // **
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";

      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },

    //** */
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;

      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;

      UICtrl.showEditState();
    },
    //*
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // turn  node list to array
      listItems = Array.from(listItems);
      //
      listItems.forEach(item => {
        item.remove();
      });
    },

    // **
    clearEditState: function() {
      // 1- make sure input are clear
      UICtrl.clearInput();
      // 2 - hide & update btn when not in edit state
      // make sure add btn is shown
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    // **
    showEditState: function() {
      //show btns when not in edit state
      // make sure add btn is hide
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },

    // // **  make public UISelectors
    getSelectors: function() {
      return UISelectors;
    }
  }; // END return - Public method
})();

// ===================== App Controller =====================================//

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // function expression load event listener
  const LoadEventListeners = function() {
    // Get UI Selectors
    const UISelectors = UICtrl.getSelectors();
    // Add item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    // Disable submit on key 'Enter'
    document.addEventListener("keypress", event => {
      // key 'Enter' === 13
      if (event.keycode === 13 || event.which === 13) {
        event.preventDefault();
        return false;
      }
    });

    // Edit icon click - cannot be access directly
    // use event delegation
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);

    // Update item with update btn event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete item with update btn event
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Back button
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Clear button
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsClick);
  }; // END  LoadEventListeners()

  // Add itemAddSubmit
  const itemAddSubmit = function(event) {
    // A -> make sure there is input
    // B -> Get form input to UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calories and input
    if (input.name !== "" && input.calories !== "") {
      // 1 - Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // 2 - Add item to UI list
      UICtrl.addListItems(newItem);
      // 3 - Get total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // 4 - Get total Calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //Store in local storage
      StorageCtrl.storeItem(newItem);

      // 5 - Clear fields
      UICtrl.clearInput();
    } // end if()

    // prevent default behavior
    event.preventDefault();
  }; // End itemAddSubmit

  //  Edit item clicked
  const itemEditClick = function(event) {
    //Target the edit icon
    if (event.target.classList.contains("edit-item")) {
      // 1 -  Get the list item id
      const listId = event.target.parentNode.parentNode.id;
      // 2 - break into an array
      const listIdArr = listId.split("-");
      // 3 - get the actual Id
      const id = parseInt(listIdArr[1]);
      // 4 - get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // set current item from data structure
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    }
    // prevent default behavior
    event.preventDefault();
  };

  //Update item submit
  const itemUpdateSubmit = function(event) {
    // get item input
    const input = UICtrl.getItemInput();
    //Update Item from form input
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
    //Update UI
    UICtrl.updateItem(updatedItem);
    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Update Local storage
    StorageCtrl.updateItemStorage(updatedItem);

    //clear
    UICtrl.clearEditState();

    event.preventDefault();
  };

  // Delete item  submit
  const itemDeleteSubmit = function(event) {
    // Get ID from current item
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from Data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from the UI
    UICtrl.deleteListItem(currentItem.id);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    // Delete from Local Storage
    StorageCtrl.deleteItemFromStorage(currentItem.id);

    //clear
    UICtrl.clearEditState();

    event.preventDefault();
  };

  // clearAllItems event
  const clearAllItemsClick = function(event) {
    // delete all items from data structure
    ItemCtrl.clearAllItems();

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Remove from the UI
    UICtrl.removeItems();
    // clear from ls
    StorageCtrl.clearItemFromStorage();

    //Hide Ul
    UICtrl.hideList();

    event.preventDefault();
  };

  // Public method - Init -> initializer for the app -anythings we want to run when app load
  return {
    init: function() {
      console.log("Initializing App....");
      //Clear edit state / set initial state
      UICtrl.clearEditState();

      //**Fetch items from data structure
      const items = ItemCtrl.getItems();
      // Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        // Populate list with items
        UICtrl.populateItemslist(items);
      }

      //**Get total Calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //** Get total Calories to the UI
      UICtrl.showTotalCalories(totalCalories);

      //** load event listener
      LoadEventListeners();
    }
  }; // END return - Public method
})(ItemCtrl, StorageCtrl, UICtrl);

//Initialize app
App.init();
