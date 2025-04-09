import { useMDXComponent } from 'next-contentlayer/hooks';

import Content from '~/components/content';
import Youtube from '~/components/embed/youtube';

import { Space } from './embed/space';

type Props = {
  code: string;
};

const MDXComponents = {
  Youtube,
  Space,
};

const MDXContent = ({ code }: Props) => {
  const MDX = useMDXComponent(code);

  return (
    <Content>
      <MDX components={MDXComponents} />
    </Content>
  );
};

export default MDXContent;
