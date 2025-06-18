import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BoardListSidebar from '../components/SideBar';
import BoardDetail from '../components/BoardDetail';
import { api_url } from '../config';

const HomePage = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    fetch(`${api_url}boards`)
      .then(res => res.json())
      .then(data => setBoards(data));
  }, []);

  const selectBoard = (board) => setSelectedBoard(board);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }} className="app-container">
      <BoardListSidebar boards={boards} onSelect={selectBoard} setBoards={setBoards} setSelectedBoard={setSelectedBoard}  />
      {selectedBoard && <BoardDetail board={selectedBoard} />}
    </div>
  )
}

export default HomePage
