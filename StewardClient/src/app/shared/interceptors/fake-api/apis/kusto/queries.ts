import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GameTitleCodeName } from '@models/enums';
import { KustoQueries } from '@models/kusto/kusto-queries';
import faker from 'faker';

/** Fake API for getting kusto predefined queries. */
export class KustoGetQueriesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/kusto\/queries$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): KustoQueries {
    return KustoGetQueriesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): KustoQueries {
    return [
      {
        id: faker.datatype.uuid(),
        name: 'Lorem Ipsum',
        title: GameTitleCodeName.Street,
        query: `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet arcu feugiat eros ullamcorper, at bibendum libero maximus. Nunc vel ex et ipsum auctor lacinia. Nulla sagittis, magna vel hendrerit porta, est sem porttitor lacus, at varius urna erat at nulla. Sed in ligula sapien. Nunc ultricies rutrum odio ac elementum. Vestibulum luctus erat ligula, in scelerisque massa suscipit eget. Nunc volutpat dapibus turpis posuere semper. Phasellus dictum sed odio vitae tempus. Vestibulum vitae ante nec nunc mattis ullamcorper.

          Suspendisse vitae tellus lacinia, tempor diam nec, laoreet tellus. In nec varius tortor. Etiam a est nulla. Phasellus hendrerit efficitur neque, vel commodo tortor blandit a. Aliquam sed imperdiet arcu, nec facilisis urna. Integer tincidunt rhoncus fringilla. Nullam in mauris dapibus, porttitor dui vel, varius libero. Praesent condimentum dolor vitae commodo semper. Phasellus ultricies nisl quis est pellentesque hendrerit. Sed luctus mi a tristique euismod. Nam risus elit, dapibus quis nulla nec, maximus faucibus ex. Nulla sollicitudin, nulla at fermentum laoreet, sapien nibh tempor erat, ut porta mi felis at velit. Morbi vestibulum finibus libero, vitae hendrerit ligula imperdiet eu. Donec sed iaculis metus. Mauris ac arcu arcu. Pellentesque suscipit neque erat.
          
          Integer eu urna at urna eleifend sagittis. Cras non dui sapien. Integer aliquam diam sed quam convallis malesuada. Phasellus tristique interdum mi non venenatis. Nunc a lobortis magna, ut maximus lorem. Morbi pulvinar, massa vitae tincidunt posuere, est dolor facilisis lorem, non semper purus nisi sed nulla. Curabitur justo est, ullamcorper quis risus eget, sodales efficitur purus. Donec quis nunc id ligula porttitor congue a ut ex. Nullam at eros id dolor pretium vehicula. Nulla facilisi. In eu dui ac est maximus finibus eget id nunc. Aenean fringilla ipsum odio, aliquet sagittis arcu porttitor porttitor. Phasellus dictum, ipsum a interdum tempus, felis dui molestie sapien, sed pellentesque sem lacus vel nisi. Aliquam aliquam turpis eget varius vestibulum.
          
          In hac habitasse platea dictumst. Sed quis semper ligula. Vivamus scelerisque tortor accumsan neque lacinia, nec ullamcorper nunc ultricies. Maecenas hendrerit ligula sed interdum posuere. Fusce vitae eros vitae nulla efficitur viverra. Ut ut mauris eu eros iaculis tempus sit amet sit amet mauris. Vivamus ut nunc at lectus rhoncus rhoncus eu at ligula. Phasellus placerat elit magna, at consectetur mauris sagittis vel. Donec eget ultricies quam. Morbi pellentesque nibh lorem, ut sagittis erat convallis quis. Donec ultricies luctus quam in laoreet.
          
          Nullam placerat at odio quis tristique. Vestibulum sed mi et nunc maximus tempus. Nulla sit amet ultricies est. Vivamus lorem nunc, consequat eu libero in, dignissim pharetra ipsum. Etiam finibus felis justo, et sagittis nisi viverra quis. Nunc dolor risus, viverra a urna quis, cursus scelerisque arcu. Vestibulum scelerisque mollis elementum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Pellentesque blandit ornare purus, et fringilla quam interdum in. Ut vehicula euismod dignissim.
          
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus aliquet arcu feugiat eros ullamcorper, at bibendum libero maximus. Nunc vel ex et ipsum auctor lacinia. Nulla sagittis, magna vel hendrerit porta, est sem porttitor lacus, at varius urna erat at nulla. Sed in ligula sapien. Nunc ultricies rutrum odio ac elementum. Vestibulum luctus erat ligula, in scelerisque massa suscipit eget. Nunc volutpat dapibus turpis posuere semper. Phasellus dictum sed odio vitae tempus. Vestibulum vitae ante nec nunc mattis ullamcorper.

          Suspendisse vitae tellus lacinia, tempor diam nec, laoreet tellus. In nec varius tortor. Etiam a est nulla. Phasellus hendrerit efficitur neque, vel commodo tortor blandit a. Aliquam sed imperdiet arcu, nec facilisis urna. Integer tincidunt rhoncus fringilla. Nullam in mauris dapibus, porttitor dui vel, varius libero. Praesent condimentum dolor vitae commodo semper. Phasellus ultricies nisl quis est pellentesque hendrerit. Sed luctus mi a tristique euismod. Nam risus elit, dapibus quis nulla nec, maximus faucibus ex. Nulla sollicitudin, nulla at fermentum laoreet, sapien nibh tempor erat, ut porta mi felis at velit. Morbi vestibulum finibus libero, vitae hendrerit ligula imperdiet eu. Donec sed iaculis metus. Mauris ac arcu arcu. Pellentesque suscipit neque erat.
          
          Integer eu urna at urna eleifend sagittis. Cras non dui sapien. Integer aliquam diam sed quam convallis malesuada. Phasellus tristique interdum mi non venenatis. Nunc a lobortis magna, ut maximus lorem. Morbi pulvinar, massa vitae tincidunt posuere, est dolor facilisis lorem, non semper purus nisi sed nulla. Curabitur justo est, ullamcorper quis risus eget, sodales efficitur purus. Donec quis nunc id ligula porttitor congue a ut ex. Nullam at eros id dolor pretium vehicula. Nulla facilisi. In eu dui ac est maximus finibus eget id nunc. Aenean fringilla ipsum odio, aliquet sagittis arcu porttitor porttitor. Phasellus dictum, ipsum a interdum tempus, felis dui molestie sapien, sed pellentesque sem lacus vel nisi. Aliquam aliquam turpis eget varius vestibulum.
          
          In hac habitasse platea dictumst. Sed quis semper ligula. Vivamus scelerisque tortor accumsan neque lacinia, nec ullamcorper nunc ultricies. Maecenas hendrerit ligula sed interdum posuere. Fusce vitae eros vitae nulla efficitur viverra. Ut ut mauris eu eros iaculis tempus sit amet sit amet mauris. Vivamus ut nunc at lectus rhoncus rhoncus eu at ligula. Phasellus placerat elit magna, at consectetur mauris sagittis vel. Donec eget ultricies quam. Morbi pellentesque nibh lorem, ut sagittis erat convallis quis. Donec ultricies luctus quam in laoreet.
      `,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 1',
        query: 'Test Query 1',
        title: GameTitleCodeName.Street,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 2',
        query: 'Test Query 2',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 3',
        query: 'Test Query 3',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 6',
        query: 'Test Query 6',
        title: GameTitleCodeName.FH4,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 9',
        query: 'Test Query 9',
        title: GameTitleCodeName.FM7,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 10',
        query: 'Test Query 10',
        title: GameTitleCodeName.FM7,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 7',
        query: 'Test Query 7',
        title: GameTitleCodeName.FH3,
      },
      {
        id: faker.datatype.uuid(),
        name: 'Test Query 8',
        query: 'Test Query 8',
        title: GameTitleCodeName.FH3,
      },
    ];
  }
}
