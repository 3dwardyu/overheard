import { OverheardMeanPage } from './app.po';

describe('overheard-mean App', () => {
  let page: OverheardMeanPage;

  beforeEach(() => {
    page = new OverheardMeanPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
