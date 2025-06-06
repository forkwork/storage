import type { GetServerSideProps } from 'next';
import * as khulnasoftBlob from '@khulnasoft/blob';

export const getServerSideProps: GetServerSideProps = async (req) => {
  const filename = req.query.filename as string;
  const blob = await khulnasoftBlob.put(filename, `Hello from ${filename}`, {
    access: 'public',
    addRandomSuffix: true,
  });
  const content = await fetch(blob.url).then((r) => r.text());

  return {
    props: {
      ...blob,
      content,
    },
  };
};

export default function Blob(
  props: khulnasoftBlob.PutBlobResult & { content: string },
): React.JSX.Element {
  return (
    <div>
      <h1 className="text-xl mb-4">blob</h1>

      <p id="blob-path">{props.pathname}</p>
      <p id="blob-content">{props.content}</p>
    </div>
  );
}
