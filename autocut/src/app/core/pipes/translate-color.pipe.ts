import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateColor',
  standalone: true,
})
export class TranslateColorPipe implements PipeTransform {
  private translations: Record<string, string> = {
    white: 'Blanco',
    black: 'Negro',
    silver: 'Plateado',
    gray: 'Gris',
    red: 'Rojo',
    blue: 'Azul',
    green: 'Verde',
    yellow: 'Amarillo',
    orange: 'Naranja',
    purple: 'Morado',
    brown: 'Marrón',
    gold: 'Dorado',
    beige: 'Beige',
    pink: 'Rosa',
    cyan: 'Cian',
    turquoise: 'Turquesa',
    navy: 'Azul marino',
    maroon: 'Granate',
    bronze: 'Bronce',
    champagne: 'Champán',
    teal: 'Verde azulado',
    magenta: 'Magenta',
    lime: 'Verde lima',
    olive: 'Verde oliva',
    burgundy: 'Burdeos',
    copper: 'Cobre',
    charcoal: 'Gris oscuro',
    mint: 'Menta',
    ivory: 'Marfil',
    pearl: 'Perla',
  };

  transform(value: string): string {
    if (!value) return '';
    return this.translations[value.toLowerCase()] || value;
  }
}
