import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="hero__container">
        <h1 className="hero__title"><img src="../../static/img/luvit-logo-white.svg"/></h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className="hero-buttons-container">
        <Link
            className="hero-button"
            to="https://github.com/truemedian/luvit-bin/releases/download/2021-08-22/luvit-bin-Windows-x86_64.zip">
            Download for Windows (x64)
          </Link>
          <Link
            className="hero-button"
            to="https://github.com/truemedian/luvit-bin/releases/download/2021-08-22/luvit-bin-Linux-x86_64.tar.gz">
            Download for Linux (x64)
          </Link>
        </div>
        <Link
          className="hero-text"
          to="https://github.com/truemedian/luvit-bin/releases/">
            Other Platforms
        </Link>
        <Link
          className="hero-text"
          to="https://github.com/luvit/luvit/blob/master/ChangeLog">
            Changelog
        </Link>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title=""
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
