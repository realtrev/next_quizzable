export default function Head({ params }: { params: { slug: string } }) {
  return (
    <>
      <title>Quizzable</title>
      <meta
        name="description"
        content="Quizzable is an app designed to help you study."
      />
      <link rel="icon" href="/favicon.ico" />
    </>
  );
}
