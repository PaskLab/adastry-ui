import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Time Saving',
    Svg: require('@site/static/img/clock.svg').default,
    description: (
      <>
        Tracking many wallet accounts is time consuming. Adastry takes care of packaging your data
        in a ready to use <code>CSV</code> format.
      </>
    ),
  },
  {
    title: 'All in One place',
    Svg: require('@site/static/img/target.svg').default,
    description: (
      <>
        Monitor all your accounts in a single place, no matter your preferred wallet software. Want
        to see all accounts as a single one? Export them using <strong>Bulk Export</strong>!
      </>
    ),
  },
  {
    title: 'Spot Price',
    Svg: require('@site/static/img/chart.svg').default,
    description: (
      <>
        Adastry fetch epoch rewards distribution spot price in your preffered currency. We support{' '}
        <strong>168</strong> different currencies, including <strong>Gold</strong> and{' '}
        <strong>Bitcoin</strong>!
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
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
