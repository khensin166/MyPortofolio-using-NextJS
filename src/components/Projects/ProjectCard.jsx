import React from "react";

import Image from "next/image";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, description, tags, demoUrl, sourceUrl },
}) => {
  return (
    <div className={styles.container}>
      <Image
        src={getImageUrl(imageSrc)}
        alt={`Image of ${title}`}
        width={400}
        height={300}
        className={styles.image}
      />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.skills}>
        {(tags || []).map((skill, id) => {
          return (
            <li key={id} className={styles.skill}>
              {skill}
            </li>
          );
        })}
      </ul>
      <div className={styles.links}>
        <a href={demoUrl} className={styles.link} target="_blank">
          Demo
        </a>
        <a href={sourceUrl} className={styles.link} target="_blank">
          Source
        </a>
      </div>
    </div>
  );
};
