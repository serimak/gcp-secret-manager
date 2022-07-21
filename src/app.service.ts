import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// const name = 'projects/my-project/secrets/my-secret/versions/latest';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  client = new SecretManagerServiceClient();
  name = `projects/${this.configService.get(
    'GCP_PROJECT',
  )}/secrets/${this.configService.get('USER_NAME')}/versions/latest`;

  async accessSecretVersion(): Promise<string> {
    const [version] = await this.client.accessSecretVersion({
      name: this.name,
    });
    // Extract the payload as a string.
    const payload = version.payload.data.toString();
    // WARNING: Do not print the secret in a production environment - this
    // snippet is showing how to access the secret material.
    console.info(`Payload: ${payload}`);
    return payload;
  }

  getSecrets(): string {
    return this.accessSecretVersion().toString();
  }
}
