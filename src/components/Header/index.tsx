import  Link  from 'next/link';
import styles from './header.module.scss';
 function Header() {
  return(
    <Link href="/">
      <header className={styles.headerContainer}>
        <img src="/images/logo.svg" alt="logo" />
      </header>
    </Link>
  );
}

export default Header;