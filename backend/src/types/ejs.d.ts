declare module 'ejs' {
  const ejs: {
    renderFile(path: string, data: Record<string, any>): Promise<string>;
    render(template: string, data?: Record<string, any>): string;
  };
  export default ejs;
}
