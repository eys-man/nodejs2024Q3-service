import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/artist.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}
  @Get()
  getAll() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.artistService.getArtistById(id);
  }

  @Post()
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateArtistDto: CreateArtistDto) {
    return this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.artistService.deleteArtist(id);
  }
}
