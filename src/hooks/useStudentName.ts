"use client";
import { useEffect, useState, useCallback } from "react";

const NAME_KEY = "student:name";

export function useStudentName() {
  const [name, setName] = useState<string>("");
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch {}
    setLoaded(true);
  }, []);

  const saveName = useCallback((newName: string) => {
    setName(newName);
    try {
      localStorage.setItem(NAME_KEY, newName);
    } catch {}
    setShowModal(false);
  }, []);

  const promptName = useCallback(() => {
    if (!name) setShowModal(true);
  }, [name]);

  return { name, loaded, showModal, setShowModal, saveName, promptName };
}