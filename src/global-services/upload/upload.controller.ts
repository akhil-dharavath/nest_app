// // import {
// //   Controller,
// //   Post,
// //   UploadedFile,
// //   UploadedFiles,
// //   UseInterceptors,
// // } from '@nestjs/common';
// // import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// // import { UploadService } from './upload.service';

// // @Controller('upload')
// // export class UploadController {
// //   constructor(private readonly uploadService: UploadService) {}

// //   @Post('single')
// //   @UseInterceptors(FileInterceptor('file'))
// //   async uploadSingle(@UploadedFile() file: Express.Multer.File) {
// //     const url = await this.uploadService.uploadImage(file);
// //     return { url };
// //   }

// //   @Post('multiple')
// //   @UseInterceptors(FilesInterceptor('files'))
// //   async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
// //     const urls = await this.uploadService.uploadMultiple(files);
// //     return { urls };
// //   }
// // }

// import {
//   Controller,
//   Post,
//   UploadedFile,
//   UploadedFiles,
//   UseInterceptors,
// } from '@nestjs/common';
// import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
// import { UploadService } from './upload.service';
// import {
//   ApiBearerAuth,
//   ApiBody,
//   ApiConsumes,
//   ApiOperation,
//   ApiTags,
// } from '@nestjs/swagger';

// @ApiTags('Upload')
// @ApiBearerAuth() // Enables Bearer token in Swagger if needed
// @Controller('upload')
// export class UploadController {
//   constructor(private readonly uploadService: UploadService) {}

//   // ---- Single File Upload ----
//   @Post('single')
//   @ApiOperation({ summary: 'Upload a single file' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Single file upload',
//     schema: {
//       type: 'object',
//       properties: {
//         file: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })
//   @UseInterceptors(FileInterceptor('file'))
//   async uploadSingle(@UploadedFile() file: Express.Multer.File) {
//     const url = await this.uploadService.uploadImage(file);
//     return { url };
//   }

//   // ---- Multiple Files Upload ----
//   @Post('multiple')
//   @ApiOperation({ summary: 'Upload multiple files' })
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     description: 'Multiple file upload',
//     schema: {
//       type: 'object',
//       properties: {
//         files: {
//           type: 'array',
//           items: {
//             type: 'string',
//             format: 'binary',
//           },
//         },
//       },
//     },
//   })
//   @UseInterceptors(FilesInterceptor('files'))
//   async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
//     const urls = await this.uploadService.uploadMultiple(files);
//     return { urls };
//   }
// }


import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // ---- Single File Upload ----
  @Post('single')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(@UploadedFile() file: Express.Multer.File) {
    const url = await this.uploadService.uploadImage(file);
    return { success: true, url };
  }

  // ---- Multiple Files Upload ----
  @Post('multiple')
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = await this.uploadService.uploadMultiple(files);
    return { success: true, urls };
  }
}
