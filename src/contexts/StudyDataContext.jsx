import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, CATEGORIES } from '../services/api';

const StudyDataContext = createContext();

export const StudyDataProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({ 
      totalHours: 0, 
      todayHours: 0, 
      currentStreak: 0, 
      bestStreak: 0, 
      weeklySummary: { hours: 0, mostFocused: 'None', completionRate: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(5); // Daily hour goal

  const fetchData = async () => {
    try {
      const fetchedLogs = await api.getLogs();
      const fetchedTasks = await api.getTasks();
      const fetchedStats = await api.getStats();
      const fetchedInsights = await api.getInsights();
      
      setLogs(fetchedLogs);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
      setInsights(fetchedInsights);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLog = async (log) => {
    await api.addLog(log);
    await fetchData();
  };

  const addTask = async (task) => {
    await api.addTask(task);
    await fetchData();
  };

  const toggleTask = async (id) => {
    await api.toggleTask(id);
    await fetchData();
  };

  const updateTask = async (id, data) => {
    await api.updateTask(id, data);
    await fetchData();
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    await fetchData();
  };

  const updateLog = async (id, data) => {
    await api.updateLog(id, data);
    await fetchData();
  };

  const deleteLog = async (id) => {
    await api.deleteLog(id);
    await fetchData();
  };

  return (
    <StudyDataContext.Provider value={{ 
        logs, tasks, insights, stats, loading, 
        addLog, addTask, toggleTask, 
        updateTask, deleteTask, updateLog, deleteLog,
        goal, setGoal, CATEGORIES 
    }}>
      {children}
    </StudyDataContext.Provider>
  );
};

export const useStudyData = () => useContext(StudyDataContext);
