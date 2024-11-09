import { TypeWriter } from '@/components/ui/type-writer';
import { GoogleLogin } from '@/app/_components/google-login';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <Navbar variant="public" />
      <div className="flex flex-col min-h-[calc(100vh-7.5rem)] p-4 w-full items-center justify-center">
        <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold text-center mb-6">
          <TypeWriter value="home.title" />
        </h1>
        <GoogleLogin />
      </div>
      <Footer />
    </>
  );
}
