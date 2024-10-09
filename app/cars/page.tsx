import CarViewer from '../components/CarViewer';
import Cars from '../components/Cars';
import styles from './Cars.module.css';
export default function ContactUs() {
  return (
      <main>
      <nav className={styles.ovalNavbar}>
        <div className={styles.navbarContent}>
          <div><a href="#">Efficycle</a></div>
          <div><a href="#">Formula Bharat</a></div>
          <div><a href="#">Car 1</a></div>
          <div><a href="#">Car 2</a></div>
        </div>
      </nav>
        <section className={styles.section}>
          <CarViewer />
        </section>
        <Cars />
        
      </main>
  );
}

