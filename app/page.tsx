import Game from '@/components/Game';

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
      }}
    >
      <Game />
    </main>
  );
}
