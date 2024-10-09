"use client";
import React, { useEffect, useState } from "react";
import {auth, db } from "./firebase";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { signInWithGoogle, logout } from "./authservice";
import styles from "./SAETeam.module.css";
import ProfileCard from './ProfileCard';

interface Member {
  id: string;
  Name: string;
  Image: string;
  Linkedin: string;
  Instagram: string;
}

const SAETeam: React.FC = () => {
  const [items, setItems] = useState<Member[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>("");
  const [editImage, setEditImage] = useState<string>("");
  const [editLinkedin, setEditLinkedin] = useState<string>("");
  const [editInstagram, setEditInstagram] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [newImage, setNewImage] = useState<string>("");
  const [newLinkedin, setNewLinkedin] = useState<string>("");
  const [newInstagram, setNewInstagram] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "Members"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Member[];
      setItems(data);
    };
    fetchItems();
  }, []);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);
 
  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Error signing in:", error);
      alert("Sign-in failed: " + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newName || !newImage) return;
    try {
      const docRef = await addDoc(collection(db, "Members"), {
        Name: newName,
        Image: newImage,
        Linkedin: newLinkedin,
        Instagram: newInstagram,
      });

      setItems((prevItems) => [
        ...prevItems,
        { id: docRef.id, Name: newName, Image: newImage, Linkedin: newLinkedin, Instagram: newInstagram },
      ]);

      // Clear the form for new member
      setNewName("");
      setNewImage("");
      setNewLinkedin("");
      setNewInstagram("");
    } catch (error: any) {
      console.error("Error adding item:", error);
    }
  };

  const handleEdit = (id: string, Name: string, Image: string, Linkedin: string, Instagram: string) => {
    setEditing(id);
    setEditName(Name);
    setEditImage(Image);
    setEditLinkedin(Linkedin);
    setEditInstagram(Instagram);
  };

  const saveEdit = async (id: string) => {
    try {
      const itemRef = doc(db, "Members", id);
      await updateDoc(itemRef, {
        Name: editName,
        Image: editImage,
        Linkedin: editLinkedin,
        Instagram: editInstagram,
      });

      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, Name: editName, Image: editImage, Linkedin: editLinkedin, Instagram: editInstagram }
            : item
        )
      );
      setEditing(null);
    } catch (error: any) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <div>
        <h3 className={styles.sectionTitle}>Core Team</h3>
      <section className={styles.profile}>
        
          {items.map((member) => (
            <div key={member.id}>
              {editing === member.id ? (
                <div>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editLinkedin}
                    onChange={(e) => setEditLinkedin(e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="text"
                    value={editInstagram}
                    onChange={(e) => setEditInstagram(e.target.value)}
                    className={styles.input}
                  />
                  <div className={styles.editingButtons}>
                    <button onClick={() => saveEdit(member.id)} className={styles.button}>
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className={`${styles.button} ${styles.cancelButton}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <ProfileCard
                  name={member.Name}
                  imageSrc={member.Image}
                  linkedinUrl={member.Linkedin}
                  instagramUrl={member.Instagram}
                />
              )}
              {isAuthenticated && editing !== member.id && (
                <button
                  onClick={() => handleEdit(member.id, member.Name, member.Image, member.Linkedin, member.Instagram)}
                  className={styles.button}
                >
                  Edit
                </button>
              )}
            </div>
          ))}
      </section>

      <div className={styles.container}>
        {isAuthenticated ? (
          <div className={styles.addItemForm}>
            <input
              type="text"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Linkedin URL"
              value={newLinkedin}
              onChange={(e) => setNewLinkedin(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Instagram URL"
              value={newInstagram}
              onChange={(e) => setNewInstagram(e.target.value)}
              className={styles.input}
            />
            <div className={styles.editingButtons}>
              <button onClick={handleAddItem} className={`${styles.button} ${styles.signInOutButton}`}>
                Add Member
              </button>
              <button onClick={handleSignOut} className={`${styles.button} ${styles.signInOutButton}`}>
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleSignIn} className={`${styles.button} ${styles.signInOutButton}`}>
            Sign In to Add Member
          </button>
        )}
      </div>
    </div>
  );
};

export default SAETeam;
