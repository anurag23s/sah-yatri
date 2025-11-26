import { useState, useEffect } from "react";
import API from "../services/api.js";

function GroupCard({ group, handleJoin }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", margin: "10px 0" }}>
      <h4>{group.from_location} → {group.to_location}</h4>
      <p>Date: {new Date(group.date).toLocaleDateString()}</p>
      <p>Members: {group.members.length} / {group.required_people}</p>
      <p>Status: {group.status}</p>
      <button onClick={() => handleJoin(group._id)} disabled={group.status !== "Open"}>
        Join Group
      </button>
    </div>
  );
}

function CabGroups() {
  const [groups, setGroups] = useState([]);
  const [formData, setFormData] = useState({
    from_location: "",
    to_location: "",
    date: "",
    required_people: 4,
  });

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await API.get("/cabgroups");
      setGroups(data);
    };
    fetchGroups();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data } = await API.post("/cabgroups", formData);
    setGroups((prev) => [...prev, data]);
    setFormData({ from_location: "", to_location: "", date: "", required_people: 4 });
  };

  const handleJoin = async (id) => {
    const { data } = await API.post(`/cabgroups/${id}/join`);
    setGroups((prev) => prev.map((g) => (g._id === id ? data : g)));
  };

  return (
    <div>
      <h2>Cab Groups</h2>
      <form onSubmit={handleCreate}>
        <input name="from_location" placeholder="From" value={formData.from_location} onChange={handleChange} required />
        <input name="to_location" placeholder="To" value={formData.to_location} onChange={handleChange} required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <input name="required_people" type="number" min="2" value={formData.required_people} onChange={handleChange} />
        <button type="submit">Create Group</button>
      </form>
      {groups.length === 0 ? <p>No groups available</p> : groups.map((group) => <GroupCard key={group._id} group={group} handleJoin={handleJoin} />)}
    </div>
  );
}

export default CabGroups;
