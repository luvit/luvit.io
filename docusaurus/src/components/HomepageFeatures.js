import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Familiar API',
    // Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Luvit implements the same APIs as <a href="https://nodejs.org" target="_blank">Node.js</a>, but in Lua!
        <br/><br/>
        This helps teams migrate without having to learn a new way of programming.
      </>
    ),
  },
  {
    title: 'Async Choice',
    // Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Choose your async model; we don’t mind; we encourage experimentation.
        <br/><br/>
        If you don’t like callbacks and event emitters, use coroutines and write blocking style code without actually blocking your event loop!
      </>
    ),
  },
  {
    title: 'Modular Core',
    // Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
      The various projects in the luvit ecosystem can be mixed and matched to build the ideal runtime for your application.
      <br/>
      <br/>
      <ul>
        <li>
          Use luv directly in luajit
        </li>
        <li>
          Use lit without node apis
        </li>
        <li>
          The possibilities are endless
        </li>
        </ul>
      </>
    ),
  },
];

function Feature({title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        {/* <Svg className={styles.featureSvg} alt={title} /> */}
      </div>
      <div className="text--left padding-horiz--md">
        <h3>{title}</h3>
        <div>{description}</div>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
