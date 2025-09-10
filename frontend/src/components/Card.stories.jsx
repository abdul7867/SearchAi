import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './Card';
import Button from './Button';

export default {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
    },
  },
};

export const Default = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is a simple card with basic content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Featured Post</CardTitle>
        <CardDescription>Published on August 26, 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md mb-4" />
        <p>
          This is a featured post with an image placeholder. The card demonstrates
          how to include visual content alongside text.
        </p>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Read More</Button>
        <Button>Share</Button>
      </CardFooter>
    </Card>
  ),
};

export const Interactive = {
  render: () => (
    <Card className="w-[350px] cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover over me to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This card has hover effects and demonstrates interactive behavior.
          Perfect for clickable content areas.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Learn More</Button>
      </CardFooter>
    </Card>
  ),
};

export const Compact = {
  render: () => (
    <Card className="w-[300px]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Compact Card</CardTitle>
        <CardDescription>Smaller padding for dense layouts</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm">Compact content with reduced spacing.</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const NoFooter = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>No Footer</CardTitle>
        <CardDescription>Sometimes you don't need a footer</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          This card demonstrates that you can use any combination of card
          components. Not every card needs all sections.
        </p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Header Only</CardTitle>
        <CardDescription>Just a header, no other content</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const ContentOnly = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent>
        <p>
          This card only has content. Useful for simple information display
          without titles or actions.
        </p>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Card 1</CardTitle>
          <CardDescription>First card in the grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the first card.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 2</CardTitle>
          <CardDescription>Second card in the grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the second card.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Card 3</CardTitle>
          <CardDescription>Third card in the grid</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content for the third card.</p>
        </CardContent>
      </Card>
    </div>
  ),
};
