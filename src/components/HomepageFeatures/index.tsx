import Heading from "@theme/Heading";
import clsx from "clsx";
import type { ReactNode } from "react";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "React 实践",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        深入理解 React
        原理与生态，组件开发、路由、Hooks、性能优化等实战经验总结。
      </>
    ),
  },
  {
    title: "TypeScript 进阶",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>TypeScript 类型体操、类型工具、工程实践，助力大型前端项目开发。</>
    ),
  },
  {
    title: "前端工程化",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>包含 Vite、CI/CD、自动化测试、性能优化等工程化最佳实践与踩坑记录。</>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
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
