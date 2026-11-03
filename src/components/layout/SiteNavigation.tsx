import Link from "next/link";
import styles from "./SiteNavigation.module.css";

type Area="home"|"systems"|"newsletter"|"studio";
export function SiteNavigation({active}:{active:Area}){
 const links:{href:string;name:string;area:Area}[]=[
   {href:"/",name:"About",area:"home"},
   {href:"/systems",name:"Systems",area:"systems"},
   {href:"/newsletter",name:"Newstr",area:"newsletter"},
   {href:"/studio",name:"Studio",area:"studio"},
 ];
 return <header className={styles.header}>
  <Link className={styles.brand} href="/" aria-label="Maximoto home">MAXIMOTO<span>.</span></Link>
  <nav className={styles.nav} aria-label="Site navigation">
    {links.map(link=><Link key={link.href} href={link.href} aria-current={active===link.area?"page":undefined}>{link.name}</Link>)}
  </nav>
 </header>;
}
