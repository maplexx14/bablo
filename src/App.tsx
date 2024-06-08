import { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { addUser, updateUserCoins, getUser, getAllUsers, clearDB } from './Database/db';
import Leaderboard from './Components/Leaderboard/Leaderboard';
import { UserOutlined, TrophyOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import buttonSvg from './assets/button.png';
import moneySvg from './assets/money.png';
import logo from './assets/logo.png';
function App() {
  const [coinCount, setCoinCount] = useState<number>(0);
  const [userId, setUserId] = useState<string>('');
  const [currentView, setCurrentView] = useState<string>('coin');

  useEffect(() => {
    const initializeApp = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (userId) {
        await addUser({ userid: userId, coins: 0 });
      }
      if (storedUserId) {
        setUserId(storedUserId);
        const user = await getUser(storedUserId);
        if (user) {
          setCoinCount(user.coins);
        }
      } else {
        const newUserId = 'Ты';
        localStorage.setItem('userId', newUserId);
        setUserId(newUserId);
      }
    };

    initializeApp();
  }, []);

  const handleButtonClick = async () => {
    const newCoinCount = coinCount + 1;
    setCoinCount(newCoinCount);
    if (userId) {
      await updateUserCoins(userId, newCoinCount);
    }
  };
 
  const handleLogout = async () => {
    localStorage.removeItem('userId');
    await clearDB(); // Clear the IndexedDB database
    setCoinCount(0);
    setUserId('');
    setCurrentView('coin');
  };

  const renderContent = () => {

    if (currentView === 'coin') {
      return (
        <div>
         
          
          <div className={styles.score}>
            <img src={moneySvg} alt="бабло" className={styles.scoreImg} />
            <h1>{coinCount}</h1>
          </div>
          <img src={buttonSvg} alt="Забирай кэш" className={styles.clickButton} onClick={handleButtonClick} />
        </div>
      );
    }

    if (currentView === 'leaderboard') {
      return <Leaderboard />;
    }
    if (currentView === 'settings'){
      return(
        <h1>чет похуй</h1>
      )
    }
    return null;
  };

  return (
    <div className={styles.app}>
       <div className={styles.topbar}>
          <a><img className={styles.logos} src={logo}/></a>
      </div>
      {renderContent()}
      {(
        <div className={styles.menu}>
          <Button ghost className={styles.btn} onClick={() => setCurrentView('coin')} shape="default" icon={<UserOutlined className={styles.icon} />} />
         
          <Button ghost className={styles.btn} onClick={() => setCurrentView('leaderboard')} shape="default" icon={<TrophyOutlined className={styles.icon} />} />
          <Button ghost className={styles.btn} onClick={() => setCurrentView('settings')} shape="default" icon={<SettingOutlined className={styles.icon} />} />
        </div>
      )}
    </div>
  );
}

export default App;
