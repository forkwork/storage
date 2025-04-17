export default function Home(): React.JSX.Element {
  return (
    <main>
      <h1 className="text-xl mb-4">
        Khulnasoft Blob Next.js Examples (
        <a href="https://github.com/khulnasoft/blob/tree/main/example">
          code on GitHub
        </a>
        )
      </h1>
      <p>
        Note: When deployed on Khulnasoft, there&apos;s a 4.5 MB file upload
        limit for browsers.
      </p>
      <p>
        Node.js https.get, axios, and got examples can be found in the{' '}
        <a href="https://github.com/khulnasoft/blob/tree/main/example/script.mts">
          khulnasoft/blob GitHub repository
        </a>
        .
      </p>
      <h2>Next.js App Router</h2>
      <ul>
        <li>
          Form body upload | Edge →{' '}
          <a href="/khulnasoft/blob/app/body/edge">/app/body/edge</a>
        </li>
        <li>
          Form body upload | Serverless →{' '}
          <a href="/khulnasoft/blob/app/body/serverless">
            /app/body/serverless
          </a>
        </li>
        <li>
          Form Data upload | Edge →{' '}
          <a href="/khulnasoft/blob/app/formdata/edge">/app/formdata/edge</a>
        </li>
        <li>
          Form Data upload | Serverless →{' '}
          <a href="/khulnasoft/blob/app/formdata/serverless">
            /app/formdata/serverless
          </a>
        </li>
        <li>
          Client Upload → <a href="/khulnasoft/blob/app/client">/app/client</a>
        </li>
        <li>
          Client Upload in a Web Worker →{' '}
          <a href="/khulnasoft/blob/app/client-webworker">
            /app/client-webworker
          </a>
        </li>
        <li>
          Client Upload (multipart) →{' '}
          <a href="/khulnasoft/blob/app/client-multipart">
            /app/client-multipart
          </a>
        </li>
        <li>
          List blob items → <a href="/khulnasoft/blob/app/list">/app/list</a>
        </li>
      </ul>
      <h2>Next.js Pages</h2>
      <p>TODO</p>
    </main>
  );
}
