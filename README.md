netBlocks
=========

Collection of abstractions for rapid network game development in node.js + socket.io + html5.

### Lib contains:

* **Collection**  
  Ensures that collection has only single appearance of specific item. Enables hashing by key (if defined).  
  *Methods*: clear, forEach, get(fnOrKey), has(fnOrItem), pull(fnOrKey), push(item), remove(fnOrItem), toArray([fn])

* **Events**  
  Simple events that can be consistently used between client and server side code.  
  *Methods*: emit(name, [args], [delay]), on(name, fn), once(name, fn), unbind(name, fn)

* **Socket**  
  Binds server logic and creates / restores session for sockets, will trigger 'new' event on connection.

* **Session**  
  Consistent session for sockets, implements expiry as well as light-weight restoring. Stores data in-memory.  
  *Methods*: get(socket), push(id), restore(id, fn)

* **NObject**  
  Network Object that manages fields that have to be synchronised through network as well as data caching. It is mainly for inheritance.  
  Additionally when inherited list of fields should be defined, that will create accessors and register fields in list of properties for sync.  
  *Methods*: data(), delta(rev).

* **User**  
  Simple user with socket and timeout (if socket is disconnected and not restored in time).  
  *Methods*: send(name, [data])

* **Lobby**  
  Lobby that has capacity and will trigger 'ready' event when it is full and bypass list of users.  
  *Methods*: join(user), leave(user)
