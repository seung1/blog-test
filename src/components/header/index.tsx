import {
  CrumpledPaperIcon,
  DrawingPinIcon,
  FileTextIcon,
  GitHubLogoIcon,
  HomeIcon,
  RocketIcon,
} from '@radix-ui/react-icons';
import { allMDXPosts, allPosts } from 'contentlayer/generated';

import { Link } from '~/components/header/link';
import ThemeSwitch from '~/components/header/theme-switch';

import { Container, Nav, Separator } from './styles';

export const Header = () => {
  const categories = [...allPosts, ...allMDXPosts].map((post) => post.category);

  const categoryToIcon = (category: string) => {
    switch (category) {
      case 'articles': // 기술적인 탐구, 스터디, TIL
        return <FileTextIcon />;
      case 'stories': // 이야기, 회고, 경험
        return <CrumpledPaperIcon />;
      case 'projects': // 학부생때 과제, 사이드 프로젝트, 회사에 맡은 업무
        return <RocketIcon />;
      case 'reviews': // 책 리뷰
        return <DrawingPinIcon />;
      default:
        return <RocketIcon />;
    }
  };
  return (
    <Container>
      <Nav>
        <Link href='/' aria-label={'Home'}>
          <HomeIcon />
        </Link>

        {categories.map((category) => (
          <Link
            key={category}
            href={`/${category}`}
            aria-label={category.charAt(0).toUpperCase() + category.slice(1)}
            allowSubpath={true}
          >
            {categoryToIcon(category)}
          </Link>
        ))}

        <Separator decorative orientation='vertical' />
        <Link href='https://github.com/seung1' aria-label={'GitHub'}>
          <GitHubLogoIcon />
        </Link>
        <ThemeSwitch />
      </Nav>
    </Container>
  );
};
