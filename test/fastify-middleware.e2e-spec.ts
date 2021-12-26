import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '@common/app.module';
import { Test, TestingModule } from '@nestjs/testing';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { kRoutePrefix } from 'fastify/lib/symbols';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', async () => {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance();
    const prefixInMiddie = instance[kRoutePrefix];
    expect(instance.prefix).toBe(prefixInMiddie);

    expect(instance.prefix).not.toBeUndefined();
    expect(instance.prefix).not.toBeNull();
    expect(prefixInMiddie).not.toBeUndefined();
    expect(prefixInMiddie).not.toBeNull();
  });
});
