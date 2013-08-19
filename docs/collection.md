# Collection ( [key] )
Collection that ensures single appearance of item. Define 'key' to enable hashing to speed up searching.

---

## Methods:
* **clear** *( )*  
  Removes all items.
  
* **delay** *( name, args, delay )*  
  
* **emit** *( name, args )*  
  
* **forEach** *( fn )*  
  Call function for each item.
  
* **get** *( fnOrKey )*  
  Returns item satisfying function or by key.
  
* **has** *( fnOrItem )*  
  True if has item or any item satisfies a function.
  
* **on** *( name, fn )*  
  
* **once** *( name, fn )*  
  
* **pull** *( fnOrKey )*  
  Removes item and returns it by key or function.
  
* **push** *( item )*  
  Add item if not already in collection.
  
* **remove** *( fnOrItem )*  
  Removes items by function or item.
  
* **toArray** *( [fn] )*  
  Returns array with items, optionally filtered by a function.
  
* **unbind** *( name, fn )*  
  
