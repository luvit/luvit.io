import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'Familiar API',
    // Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Luvit implements many of the same APIs as <a href="https://nodejs.org" target="_blank">Node.js</a>, which can help teams get started quickly if they're already familiar with the JavaScript ecosystem.
        <br/><br/>
        Coroutine-based libraries have been created for those who prefer an approach closer to the Lua way of writing asynchronous code sequentially.
      </>
    ),
  },
  {
    title: 'Packaging Made Easy',
    // Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        The Luvit ecosystem comes with its own packaging toolset, allowing you to bundle your Lua-based applications into self-contained executables.
        <br/><br/>
        You can easily install packages created by the community or publish your own,
        and libraries for many common use cases will get you started quickly.
      </>
    ),
  },
  {
    title: 'Modular Core',
    // Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
      The various components of the Luvit project can be used together or in isolation, enabling you to build the ideal environment for your application.
      <br/>
      <br/>
      From high-level application frameworks and APIs, to low-level bindings for the asynchronous I/O facilities, you decide on your prefered level of abstraction.
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
    <div>
      <div className="hero-summary-blurb">
        <p>
          Luvit is a Lua runtime built on <a href="http://luajit.org/luajit.html" target="_blank">Mike Pall's LuaJIT engine</a>.
        </p>
        <p>
          It combines the asynchronous I/O library <a href="https://docs.libuv.org" target="_blank">libuv</a>,
          which also powers JavaScript's <a href="https://nodejs.org/">NodeJS</a>,
          with useful general-purpose libraries and tools that can help you create complex Lua-based applications with ease.
        </p>
      </div>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
              ))}
          </div>
        </div>
      </section>
    </div>   
  );
}
