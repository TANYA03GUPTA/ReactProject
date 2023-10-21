//This is a bill spliting app
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

//reusable components on the top:
function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showaddfrnd, SetShowAddfrnd] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedfrnd, setselectedfrnd] = useState(null);

  function handleshowaddfrnd() {
    SetShowAddfrnd((showaddfrnd) => !showaddfrnd);
  }

  function handleAddfriends(friend) {
    setFriends((friends) => [...friends, friend]);
  }
  function handleSelection(friend) {
    // setselectedfrnd(friend);
    setselectedfrnd((cur) => (cur?.id === friend.id ? null : friend));
    SetShowAddfrnd(false);
  }
  function handleSplitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedfrnd.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setselectedfrnd(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedfrnd={selectedfrnd}
        />

        {showaddfrnd && (
          <FormAddFriend
            friend={initialFriends}
            onAddfriend={handleAddfriends}
          />
        )}

        <Button onclick={handleshowaddfrnd}>
          {showaddfrnd ? "Close" : "Add Friend"}{" "}
        </Button>
      </div>

      {/* //selected friend will short circuit and not show anything */}
      {selectedfrnd && (
        <FormSplittBill
          selectedfrnd={selectedfrnd}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedfrnd }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedfrnd={selectedfrnd}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedfrnd }) {
  const isSelected = selectedfrnd?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          Your friend {friend.name} owses you {friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name}are equal .</p>}

      <Button onclick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddfriend }) {
  const [name, setname] = useState("");
  const [image, setImg] = useState("https://i.pravatar.cc/48?u=118836");

  function handlesubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID;

    const newFriend = {
      id,
      name,
      image: `${image}? = ${id}`,
      balance: 0,
    };
    onAddfriend(newFriend);

    setname("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handlesubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        value={name}
        placeholder="Name"
        type="text"
        onChange={(e) => setname(e.target.value)}
      />
      <label>🌄🌅Image Url</label>
      <input
        value={image}
        type="text"
        onChange={(e) => setImg(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplittBill({ selectedfrnd, onSplitBill }) {
  console.log("formsplit bill show");

  const [bill, setBill] = useState("");
  const [paidbyuser, setPaidByUser] = useState("");
  const [whoisPaying, setWhoispaying] = useState("user");
  const paidbyFriend = bill ? bill - paidbyuser : "";

  function handleformsubmit(e) {
    e.preventDefault();

    if (!bill || !paidbyuser) return;
    onSplitBill(whoisPaying === "user" ? paidbyFriend : -paidbyuser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleformsubmit}>
      <h2>SPLIT A BILL WITH {selectedfrnd.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👦Your Expense</label>
      <input
        type="number"
        value={paidbyuser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidbyuser : Number(e.target.value)
          )
        }
      />

      <label>😎 {selectedfrnd.name}'s Expense</label>
      <input type="number" disabled value={paidbyFriend} />

      <label> 🤑 Who is paying the bill ?🤑</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoispaying(Number(e.target.value))}
      >
        <option value="friend">{selectedfrnd.name}</option>
        <option value="user">You</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
