import Head from 'next/head'
import styles from '../styles/Home.module.css'
import fs from 'fs'
import path from 'path'
import { useEffect, useState } from 'react';

function getCurAct(plan) {
  const cur = new Date();
  let i = plan.findIndex(item => {
    const start = new Date();
    start.setHours(item.from.split(':')[0]);
    start.setMinutes(item.from.split(':')[1]);
    const end = new Date();
    end.setHours(item.to.split(':')[0]);
    end.setMinutes(item.to.split(':')[1]);
    return (start <= cur && cur < end);
  });
  return (
    <ul className={styles.listNoBullet}>
      <li className={styles.notCurrent2}>{plan[i-2]?.activity || 'nothing'}</li>
      <li className={styles.notCurrent1}>{plan[i-1]?.activity || 'nothing'}</li>
      <li className={styles.current}>{(plan[i]?.activity + ' until ' + plan[i]?.to) || 'nothing'}</li>
      <li className={styles.notCurrent1}>{plan[i+1]?.activity || 'nothing'}</li>
      <li className={styles.notCurrent2}>{plan[i+2]?.activity || 'nothing'}</li>
    </ul>
  );
}

export default function Home({plan}) {
  const [currentActivity, setCurrentActivity] = useState("Nothing for now!");
  useEffect(() => {
    setCurrentActivity(getCurAct(plan));
    const interval = setInterval(() => {
      setCurrentActivity(getCurAct(plan));
    }, 30*1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Daily</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>{currentActivity}</div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const plan = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'myPlan.json'))).plan;
  // console.log(plan);
  return {
    props: {
      plan,
    }
  };
}