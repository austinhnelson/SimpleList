/** Importing neccessary modules */
import React, {useState} from 'react';
import { TouchableOpacity, Button, FlatList, Text, View, StyleSheet } from 'react-native';

/** Defining design styles for the app (CSS like things) */
const styles = StyleSheet.create({
  /** Background / layout */
  container: {
    flex: 1,
    backgroundColor: '#9ca49f',
    padding: 8,
  },  
  /** Each list entry is an "item" */
  item: {
    padding: 10,
    fontSize: 25,
  },
  /** Entry font size */
  title: {
    fontSize: 22,
  },
  /** Styles for operations bar */
  operations: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});

/** Initial list for the app "home screen", this is the list that will display when reset */
const initialScientists = [
  {name: "Alexander Graham Bell", id: "1", highlighted: false},
  {name: "Marie Curie", id: "2", highlighted: false},
  {name: "Robert Hooke", id: "3", highlighted: false},
]

/** Bank that will be pulled from for add button */
const bankofScientists = [
  { name: "Albert Einstein"},
  { name: "Charles Darwin"},
  { name: "Nikola Tesla"},
  { name: "Galileo Galilei"},
  { name: "Sigmond Freud"},
  { name: "Hunt Morgan"},
  { name: "J. Robert Oppenheimer"},
  { name: "Alfred Kinsey"},
  { name: "Archimedes"},
  { name: "Stephen Hawking"},
  { name: "Charles Lyell"},
  { name: "Ludwig Boltzmann"},
  { name: "Edwin Hubble"},
  { name: "B.F. Skinner"},
  { name: "Alexander Graham Bell"},
  { name: "Marie Curie"},
  { name: "Robert Hooke"},
]

/** Item variable that is responsible for how each scientist displays you see as well as the selection design */
const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.name}</Text>
  </TouchableOpacity>
);

/** 
 * Main function that is responsible for the design, logic and drawing of the app 
 */
const MyCustomList = () => {

  /** State variables for controlling "moving pieces" */
  const [list, setlist] = useState(initialScientists);
  const [count, setCount] = useState(list.length + 1);

  /** Increments the current count that tracks the unique ID for each entry */
  const incrementCount = () => {
    setCount(count + 1);
  };

  /**
   * Logic for the adding items
   */
  function addButton() {  
    /** Defining helper variables */
    let index;
    let entry;
    /** First we will get a random index for the bank of scientists to add to the list */
      do {
        /** If the list is at capacity, break so this won't run forever */
        if(list.length == bankofScientists.length){
          break;
        }
  
        index = Math.floor(Math.random() * bankofScientists.length);
        entry = bankofScientists[index];
      } while (list.some((person) => person.name == entry.name)); // this makes sure the entry is not already in the list

      /** Once you find an element that hasn't beeen added yet, add it to the list */
      const newList = list.concat({name: entry.name, id: count, highlighted: false})
      
      /** Clean up the list and increase count */
      incrementCount();

      setlist(newList);
  }

  /**
   * Logic for removing items
   */
  function removeButton() {

    /** Easy function to remove all items from the list that are highlighted */
    const newList = list.filter((item) => !item.highlighted);

    setlist(newList);

  }

  /**
   * Logic for joining items
   */
  function joinButton() {

    /** Seperate items into two lists; highlighted and nonhighlighted */
    const notHighlightedItems = list.filter((item) => !item.highlighted);
    const highlightedItems = list.filter((item) => item.highlighted);

    /** Exit if there is nothing selected */
    if(highlightedItems.length == 0) return;

    let temp3;
    let temp4;

    /** Loop through all of the highlighted items in order to concatenate the names */
    highlightedItems.forEach((item, index) => {
      if (index < 1) temp3 = item.name; // so the commas get printed right
      else {
        /** Concatenate  the names of the selected items */
        temp4 = ', ' + item.name;
        temp3 = temp3 + temp4;
      }
    })

    /** Create a single entry with the concatenatation of all the names */
    const newList = notHighlightedItems.concat({name: temp3, id: count, highlighted: false});

    /** Clean the list up */
    incrementCount();

    setlist(newList);

  }

  /** Logic for splitting apart joined items */
  function splitButton() {
    
    /** Seperate items into two lists; highlighted and nonhighlighted */
    const notHighlightedItems = list.filter((item) => !item.highlighted);
    const highlightedItems = list.filter((item) => item.highlighted);

    /** Return if there is nothing highlighted */
    if(highlightedItems.length == 0) return;

    /** Local variables to help */
    let tempList = [];
    let localCount = count;
    
    /** Loop through all of the "joined" highlighted items */
    highlightedItems.forEach((item) => {
      /** Split each highlighted item based on the ',' delimiter */
      var temp3 = item.name.split(",");
      /** Now create a temp list that holds all of these split items */
      temp3.forEach((item2) => {
        tempList.push({name: item2.trim(), id: localCount, highlighted: false});
        localCount++;
      })
    })

    /** Now place all the non highlighted items with the split items to create final list */
    const newList = notHighlightedItems.concat(tempList);

    /** Clean up list */
    setCount(localCount);

    setlist(newList);

  }

  /** Reset button to help debug list */
  function resetButton() {
    
    /** Place only the initial scientists back in the list with highlighting disabled */
    const newList = initialScientists.map((scientist) => { 
      scientist.highlighted = scientist.highlighted ? false : false;

      return scientist;
    })

    /** Update */
    setlist(newList);

  }

  /** Handles the selecting logic */
  function toggleSelect(aid){
    /** If the passed in item matches an entry in the list, add it */
    const newList = list.map((item) => {
      if(item.id == aid)
      {
        item.highlighted = !item.highlighted;
      }

      return item;
    })

    setlist(newList);
  }

  /** Responsible for drawing / updating components */
  const renderItem = ({ item }) => {
        const backgroundColor = item.highlighted ? 'red' : 'white';
        const color = item.highlighted ? 'white' : 'black';
        /** Gets item to draw */
        return (
          <Item
            item={item}
            onPress={() => {toggleSelect(item.id)}}
            backgroundColor= {{ backgroundColor }}
            textColor = {{ color }}
          />
    );
  };

  /** Handles thew view / what is displayed and attaches functions to buttons */
  var alist = <View style={styles.container} >
                <View style={styles.operations}>
                  <Button title="Add" onPress={() => addButton()}  />
                  <Button title="Remove" onPress={() => removeButton()}/>
                  <Button title="Join" onPress={() => joinButton()}/>
                  <Button title="Split" onPress={() => splitButton()}/>
                  <Button title="Reset" onPress={() => resetButton()}/>
                </View>
                <FlatList data={list}
                renderItem={renderItem}
                />
                  </View>

  return (alist);

}

export default MyCustomList;