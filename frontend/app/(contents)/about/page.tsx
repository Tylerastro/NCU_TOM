import PersonCard from "./personCard";

const contributors = [
  {
    name: "Pan Yen Chen",
    image: "/ycpan.jpg",
    title: "Professor",
    site: "https://sites.google.com/view/ycpan/home",
    twitter: "",
    facebook: "",
    github: "",
  },
  {
    name: "Tyler",
    image: "/tyler.JPG",
    site: "https://tylerastro.github.io",
    title: "Developer",
    twitter: "",
    github: "https://github.com/Tylerastro",
  },
];

export default function page() {
  return (
    <>
      <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Our team
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              If you encounter any problem with the site, please report it to
              us.
              <br />
              Direct contact:
              <a href="https://mail.google.com/mail/?view=cm&source=mailto&to=hantanglin70036440@gamil.com">
                @Tylerastro
              </a>
            </p>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              {`Currently we are not accepting PRs, you'd like to join our team in
              the early stage, please also contact`}{" "}
              <a href="https://mail.google.com/mail/?view=cm&source=mailto&to=hantanglin70036440@gamil.com">
                @Tylerastro
              </a>{" "}
              directly.
            </p>
          </div>
          <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {contributors.map((contributor) => (
              <PersonCard
                key={contributor.name}
                name={contributor.name}
                site={contributor.site}
                title={contributor.title}
                image={contributor.image}
                facebook={contributor.facebook ? contributor.facebook : ""}
                twitter={contributor.twitter ? contributor.twitter : ""}
                github={contributor.github ? contributor.github : ""}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Contributors
            </h2>
            <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
              We gratefully thank all of our contributors. Here, we list all the
              contributors to this project.
            </p>
          </div>
          <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"></div>
        </div>
      </section>
    </>
  );
}
