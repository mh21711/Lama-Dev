import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

async function getData() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/posts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

const Blog = async () => {
  const data = await getData();
  if (data.length > 0) {
    return (
      <div className={styles.mainContainer}>
        {data.map((item) => (
          <Link
            href={`/blog/${item._id}`}
            className={styles.container}
            key={item.id}
          >
            <div className={styles.imageContainer}>
              <Image
                src={item.img}
                alt=""
                width={400}
                height={250}
                className={styles.image}
              />
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>{item.title}</h1>
              <p className={styles.desc}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  } else {
    return (
      <h1 className={styles.heading}>There Is No Currenct Blog In This Application</h1>
    )
  }
};

export default Blog;
